import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";
import { Search, ShoppingCart, Star, Clock, User } from "lucide-react";

function cleanErrorMessage(err) {
  let m =
    err?.message ||
    err?.data?.detail ||
    err?.data?.message ||
    "API load failed. Please try again.";

  m = String(m);

  if (m.includes("<!doctype html") || m.includes("<html")) {
    return "Server error (500). Please check backend logs.";
  }
  if (m.length > 220) m = m.slice(0, 220) + "…";
  return m;
}

export default function Services() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info"); // info | success | error

  const role = user?.role || user?.profile?.role;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg("");
      try {
        const res = await api("/api/services/", { method: "GET" });
        const list = Array.isArray(res) ? res : res?.results || [];
        setServices(list);
      } catch (e) {
        setServices([]);
        setMsgType("error");
        setMsg(cleanErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = (q || "").trim().toLowerCase();
    if (!s) return services;
    return services.filter((x) => {
      const t = `${x?.title || ""} ${x?.description || ""} ${x?.category || ""}`.toLowerCase();
      return t.includes(s);
    });
  }, [q, services]);

  const goCheckout = (serviceId) => {
    setMsg("");

    if (!user) {
      navigate("/login");
      return;
    }
    if (role !== "BUYER") {
      setMsgType("error");
      setMsg("Login as BUYER to purchase a service.");
      return;
    }
    navigate(`/checkout/${serviceId}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Services</h1>
          <p className="text-base-content/70 mt-1">
            Browse services and checkout securely via SSLCOMMERZ.
          </p>
        </div>

        <div className="w-full md:w-[420px]">
          <label className="input input-bordered flex items-center gap-2 w-full">
            <Search size={16} className="opacity-60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              className="grow"
              placeholder="Search services..."
            />
          </label>
        </div>
      </div>

      {msg ? (
        <div className={`mt-5 alert ${msgType === "error" ? "alert-error" : msgType === "success" ? "alert-success" : ""}`}>
          <span>{msg}</span>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8">
          <Card>
            <div className="flex items-center gap-2 text-base-content/70">
              <span className="loading loading-spinner loading-sm" />
              Loading services...
            </div>
          </Card>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div key={s.id} className="card bg-base-100 shadow border border-base-200">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <span className="badge badge-outline">{s.category || "—"}</span>
                  <span className="badge badge-primary badge-outline">
                    <Star size={14} className="mr-1" />
                    {s.avg_rating ? Number(s.avg_rating).toFixed(1) : "New"}
                  </span>
                </div>

                <h2 className="card-title mt-2">{s.title}</h2>
                <p className="text-sm text-base-content/70 line-clamp-3">
                  {s.description || "—"}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-base-content/60">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} /> {s.delivery_time_days ?? "—"} days
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User size={14} /> {s.seller?.username || "Seller"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-base-content/60">Starting at</div>
                    <div className="text-2xl font-extrabold">${s.price}</div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/services/${s.id}`} className="btn btn-ghost btn-sm">
                      Details
                    </Link>

                    {/* ✅ UPDATED BUY: goes to checkout */}
                    <button
                      onClick={() => goCheckout(s.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <ShoppingCart size={16} />
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full">
              <Card>
                <div className="text-base-content/70">No services found.</div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}