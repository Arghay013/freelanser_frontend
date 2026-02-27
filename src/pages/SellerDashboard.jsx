import { useEffect, useState } from "react";
import Card from "../ui/Card";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!user) return;

    (async () => {
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
      }
    })();
  }, [user?.username]);

  const updateStatus = async (orderId, status) => {
    await api(`/api/orders/${orderId}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    const odata = await api("/api/orders/seller/", { method: "GET" });
    const olist = Array.isArray(odata) ? odata : (odata?.results || []);
    setOrders(olist);
  };

  if (!user) {
    return <div className="mx-auto max-w-6xl px-4 py-8 text-base-content/70">Please login.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid gap-4 md:grid-cols-2">
      <div>
        <div className="text-2xl font-bold">Seller Dashboard</div>
        <div className="text-sm text-base-content/70">Your services & orders.</div>

        <div className="mt-4 grid gap-3">
          <Card>
            <div className="font-semibold">My Services</div>

            <div className="mt-2 grid gap-2">
              {services.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-base-200 p-3">
                  <div>
                    <div className="font-semibold">{s.title || "Service"}</div>
                    <div className="text-xs text-base-content/60">
                      {s.category || "General"} • {(s.delivery_time_days ?? s.delivery_days ?? "—")} days
                    </div>
                  </div>
                  <div className="font-bold">${Number(s.price || 0)}</div>
                </div>
              ))}

              {services.length === 0 && <div className="text-sm text-base-content/70">No services yet.</div>}
            </div>
          </Card>
        </div>
      </div>

      <div>
        <Card>
          <div className="font-semibold">Incoming Orders</div>

          <div className="mt-2 grid gap-2">
            {orders.map((o) => (
              <div key={o.id} className="rounded-lg border border-base-200 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{o.service?.title || "Service"}</div>
                    <div className="text-sm text-base-content/70">Buyer: {o.buyer?.username || "—"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-base-content/60">Status</div>
                    <div className="font-bold">{o.status || "—"}</div>
                  </div>
                </div>

                <div className="mt-2 flex gap-2">
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

            {orders.length === 0 && <div className="text-sm text-base-content/70">No orders yet.</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}