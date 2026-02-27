import { useEffect, useState } from "react";
import Card from "../ui/Card";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/api/orders/buyer/", { method: "GET" });
        const list = Array.isArray(data) ? data : (data?.results || []);
        setOrders(list);
      } catch {
        setOrders([]);
      }
    })();
  }, []);

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-base-content/70">
        Please login.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-2xl font-bold">Buyer Dashboard</div>
      <div className="text-sm text-base-content/70">Track your orders and status.</div>

      <div className="mt-4 grid gap-3">
        {orders.map((o) => (
          <Card key={o.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link className="font-semibold hover:underline" to={`/services/${o.service?.id || ""}`}>
                  {o.service?.title || "Service"}
                </Link>

                <div className="text-sm text-base-content/70">
                  Seller: {o.seller?.username || "—"}
                </div>

                <div className="text-sm text-base-content/70">
                  Created: {o.created_at ? new Date(o.created_at).toLocaleString() : "—"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-base-content/60">Status</div>
                <div className="font-bold">{o.status || "—"}</div>
              </div>
            </div>

            {o.buyer_requirements && (
              <div className="mt-2 text-sm text-base-content/80">
                Your note: {o.buyer_requirements}
              </div>
            )}
          </Card>
        ))}

        {orders.length === 0 && (
          <div className="text-base-content/70">No orders yet.</div>
        )}
      </div>
    </div>
  );
}