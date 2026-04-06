import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";
import { Search, ShoppingCart, Star, Clock, User, ArrowRight } from "lucide-react";

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

const FALLBACK_IMG = "https://placehold.co/900x600?text=Service";

export default function Services() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");

  const role = user?.role || user?.profile?.role;

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setMsg("");
      try {
        const res = await api("/api/services/", { method: "GET" });
        const list = Array.isArray(res) ? res : res?.results || [];
        if (alive) setServices(list);
      } catch (e) {
        if (alive) {
          setServices([]);
          setMsgType("error");
          setMsg(cleanErrorMessage(e));
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
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
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <section className="rounded-[32px] border border-base-200 bg-base-100 p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Browse marketplace services
            </div>
            <h1 className="mt-4 text-4xl font-black text-base-content sm:text-5xl">Find the right service for your project</h1>
            <p className="mt-4 text-base leading-8 text-base-content/70">
              Cleaner service cards, better spacing, and easier browsing while keeping the existing functionality fully unchanged.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <label className="flex h-14 items-center gap-3 rounded-[22px] border border-base-200 bg-base-100 px-4 shadow-sm">
              <Search size={18} className="opacity-60" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                className="h-full w-full bg-transparent outline-none"
                placeholder="Search by title, description, or category..."
              />
            </label>
          </div>
        </div>
      </section>

      {msg ? (
        <div className={`alert ${msgType === "error" ? "alert-error" : msgType === "success" ? "alert-success" : ""}`}>
          <span>{msg}</span>
        </div>
      ) : null}

      {loading ? (
        <Card>
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="loading loading-spinner loading-sm" />
            Loading services...
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => {
            const imgSrc = s.image || s.thumbnail || s.image_url || FALLBACK_IMG;

            return (
              <div
                key={s.id}
                className="group overflow-hidden rounded-[30px] border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={s.title || "Service"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== FALLBACK_IMG) {
                        e.currentTarget.src = FALLBACK_IMG;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 badge badge-outline rounded-full border-white/30 bg-base-100/90 px-3 py-3 font-medium text-base-content">
                    {s.category || "—"}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">Starting at</div>
                      <div className="mt-1 text-3xl font-black text-white">${s.price}</div>
                    </div>
                    <div className="badge badge-warning rounded-full border-none px-3 py-3 font-semibold text-warning-content">
                      <Star size={14} className="mr-1" />
                      {s.avg_rating ? Number(s.avg_rating).toFixed(1) : "New"}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h2 className="text-xl font-black text-base-content line-clamp-2">{s.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-base-content/70">{s.description || "—"}</p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-base-content/65">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5">
                      <Clock size={14} /> {s.delivery_time_days ?? "—"} days
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5">
                      <User size={14} /> {s.seller?.username || "Seller"}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <Link to={`/services/${s.id}`} className="btn btn-ghost rounded-2xl px-4">
                      Details
                    </Link>

                    <button
                      onClick={() => goCheckout(s.id)}
                      className="btn btn-primary rounded-2xl px-5 shadow-sm"
                      title="Buy (Checkout)"
                    >
                      <ShoppingCart size={16} />
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full">
              <Card>
                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                  <div className="text-lg font-semibold text-base-content">No services found</div>
                  <p className="max-w-md text-sm text-base-content/70">Try a different keyword to discover more matching services.</p>
                  <button className="btn btn-outline rounded-2xl" onClick={() => setQ("")}>Clear search <ArrowRight size={16} /></button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}