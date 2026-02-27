import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";
import { Briefcase, ClipboardList, CheckCircle2, Timer } from "lucide-react";

const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED") return "badge-success";
  if (s === "IN_PROGRESS") return "badge-warning";
  if (s === "PENDING") return "badge-info";
  return "badge-ghost";
};

export default function SellerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const odata = await api("/api/orders/seller/", { method: "GET" });
      const olist = Array.isArray(odata) ? odata : (odata?.results || []);
      setOrders(olist);
    } catch {
      setOrders([]);
    }

    try {
      const sdata = await api("/api/services/", { method: "GET" });
      const slist = Array.isArray(sdata) ? sdata : (sdata?.results || []);
      const mine = slist.filter((s) => (s.seller?.username || s.seller_username) === user?.username);
      setServices(mine);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username]);

  const updateStatus = async (orderId, status) => {
    await api(`/api/orders/${orderId}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    await fetchAll();
  };

  const completedOrders = useMemo(
    () => orders.filter((o) => String(o.status).toUpperCase() === "COMPLETED").length,
    [orders]
  );
  const inProgressOrders = useMemo(
    () => orders.filter((o) => String(o.status).toUpperCase() === "IN_PROGRESS").length,
    [orders]
  );

  if (!user) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-base-content/70">Please login.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Seller Dashboard</h1>
        <p className="text-base-content/70">Manage services and update order status.</p>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-base-100 border border-base-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <Briefcase size={16} /> My services
          </div>
          <div className="text-3xl font-extrabold mt-1">{services.length}</div>
        </div>
        <div className="rounded-3xl bg-base-100 border border-base-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <Timer size={16} /> In progress
          </div>
          <div className="text-3xl font-extrabold mt-1">{inProgressOrders}</div>
        </div>
        <div className="rounded-3xl bg-base-100 border border-base-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <CheckCircle2 size={16} /> Completed
          </div>
          <div className="text-3xl font-extrabold mt-1">{completedOrders}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Services */}
        <Card title="My Services">
          {loading ? (
            <div className="flex items-center gap-2 text-base-content/70">
              <span className="loading loading-spinner loading-sm" />
              Loading services...
            </div>
          ) : (
            <div className="grid gap-2">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-2xl border border-base-200 p-4 hover:bg-base-200/40 transition"
                >
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{s.title || "Service"}</div>
                    <div className="text-xs text-base-content/60 mt-1">
                      {s.category || "General"} • {(s.delivery_time_days ?? s.delivery_days ?? "—")} days
                    </div>
                  </div>
                  <div className="font-extrabold text-lg">${Number(s.price || 0)}</div>
                </div>
              ))}

              {services.length === 0 && (
                <div className="text-sm text-base-content/70">No services yet.</div>
              )}
            </div>
          )}
        </Card>

        {/* Orders */}
        <Card title="Incoming Orders" actions={<div className="badge badge-outline">{orders.length}</div>}>
          {loading ? (
            <div className="flex items-center gap-2 text-base-content/70">
              <span className="loading loading-spinner loading-sm" />
              Loading orders...
            </div>
          ) : (
            <div className="grid gap-3">
              {orders.map((o) => (
                <div key={o.id} className="rounded-2xl border border-base-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <ClipboardList size={16} className="opacity-80" />
                        <div className="font-semibold truncate">{o.service?.title || "Service"}</div>
                      </div>
                      <div className="text-sm text-base-content/70 mt-1">
                        Buyer: <span className="font-medium text-base-content">{o.buyer?.username || "—"}</span>
                      </div>
                    </div>

                    <div className={`badge ${statusBadge(o.status)} badge-outline font-semibold`}>
                      {o.status || "—"}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(o.id, "IN_PROGRESS")}
                      className="btn btn-sm btn-outline"
                    >
                      Mark In Progress
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(o.id, "COMPLETED")}
                      className="btn btn-sm btn-primary"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-sm text-base-content/70">No orders yet.</div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}