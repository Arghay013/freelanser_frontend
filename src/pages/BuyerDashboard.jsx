import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import { Package, Search, ArrowUpRight } from "lucide-react";

const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED") return "badge-success";
  if (s === "IN_PROGRESS") return "badge-warning";
  if (s === "PENDING") return "badge-info";
  return "badge-ghost";
};

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api("/api/orders/buyer/", { method: "GET" });
        const list = Array.isArray(data) ? data : (data?.results || []);
        setOrders(list);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return orders;
    return orders.filter((o) => {
      const title = String(o.service?.title || "").toLowerCase();
      const seller = String(o.seller?.username || "").toLowerCase();
      const st = String(o.status || "").toLowerCase();
      return title.includes(s) || seller.includes(s) || st.includes(s);
    });
  }, [orders, q]);

  const completedCount = orders.filter((o) => String(o.status).toUpperCase() === "COMPLETED").length;
  const inProgressCount = orders.filter((o) => String(o.status).toUpperCase() === "IN_PROGRESS").length;

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-base-content/70">
        Please login.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Buyer Dashboard</h1>
          <p className="text-base-content/70">Track your orders, delivery status, and notes.</p>
        </div>

        <Link to="/services" className="btn btn-primary">
          Browse services <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-base-100 border border-base-200 p-5 shadow-sm">
          <div className="text-sm text-base-content/70">Total orders</div>
          <div className="text-3xl font-extrabold mt-1">{orders.length}</div>
        </div>
        <div className="rounded-3xl bg-base-100 border border-base-200 p-5 shadow-sm">
          <div className="text-sm text-base-content/70">In progress</div>
          <div className="text-3xl font-extrabold mt-1">{inProgressCount}</div>
        </div>
        <div className="rounded-3xl bg-base-100 border border-base-200 p-5 shadow-sm">
          <div className="text-sm text-base-content/70">Completed</div>
          <div className="text-3xl font-extrabold mt-1">{completedCount}</div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="join w-full">
        <div className="join-item btn btn-ghost pointer-events-none">
          <Search size={16} />
        </div>
        <input
          className="join-item input input-bordered w-full"
          placeholder="Search by service, seller, status..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* LIST */}
      {loading ? (
        <Card>
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="loading loading-spinner loading-sm" />
            Loading your orders...
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((o) => (
            <Card
              key={o.id}
              className="hover:shadow-md transition"
              title={
                <div className="flex items-center gap-2">
                  <Package size={18} className="opacity-80" />
                  <Link className="hover:underline" to={`/services/${o.service?.id || ""}`}>
                    {o.service?.title || "Service"}
                  </Link>
                </div>
              }
              actions={
                <div className={`badge ${statusBadge(o.status)} badge-outline font-semibold`}>
                  {o.status || "—"}
                </div>
              }
            >
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="text-base-content/70">
                  Seller: <span className="font-medium text-base-content">{o.seller?.username || "—"}</span>
                </div>
                <div className="text-base-content/70 sm:text-right">
                  Created:{" "}
                  <span className="font-medium text-base-content">
                    {o.created_at ? new Date(o.created_at).toLocaleString() : "—"}
                  </span>
                </div>
              </div>

              {o.buyer_requirements && (
                <div className="rounded-2xl bg-base-200 p-4 text-sm">
                  <div className="text-xs text-base-content/60 mb-1">Your note</div>
                  <div className="text-base-content/80">{o.buyer_requirements}</div>
                </div>
              )}
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card>
              <div className="text-base-content/70">No orders yet.</div>
              <Link to="/services" className="btn btn-sm btn-primary mt-3 w-fit">
                Explore services
              </Link>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}