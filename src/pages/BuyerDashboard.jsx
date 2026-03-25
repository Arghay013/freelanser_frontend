import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Card from "../ui/Card";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";
import { Package, Search, ArrowUpRight } from "lucide-react";

const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED") return "badge-success";
  if (s === "IN_PROGRESS") return "badge-warning";
  if (s === "AWAITING_PAYMENT") return "badge-secondary";
  if (s === "SELLER_UPDATED") return "badge-primary";
  if (s === "CHANGES_REQUESTED") return "badge-error";
  if (s === "REQUESTED") return "badge-info";
  return "badge-ghost";
};

export default function BuyerDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState(location.state?.success || "");
  const [error, setError] = useState("");
  const [paymentForm, setPaymentForm] = useState({});
  const [busyId, setBusyId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api("/api/orders/buyer/", { method: "GET" });
      const list = Array.isArray(data) ? data : data?.results || [];
      setOrders(list);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
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

  const updatePaymentField = (orderId, field, value) => {
    setPaymentForm((prev) => ({
      ...prev,
      [orderId]: {
        name: prev[orderId]?.name || user?.username || "",
        phone: prev[orderId]?.phone || "",
        address: prev[orderId]?.address || "",
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const reviewOrder = async (orderId, action) => {
    const note = window.prompt(
      action === "accept" ? "Optional note for accept:" : "Why are you rejecting? (optional)",
      ""
    );

    try {
      setBusyId(orderId);
      setError("");
      setMsg("");
      await api(`/api/orders/${orderId}/buyer-review/`, {
        method: "PUT",
        body: JSON.stringify({
          action,
          buyer_response_note: note || "",
        }),
      });
      await loadOrders();
      setMsg(action === "accept" ? "Order accepted. Now you can pay." : "Order rejected. Seller has been notified.");
    } catch (e) {
      setError(e?.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const payNow = async (order) => {
    const form = paymentForm[order.id] || {};
    try {
      setBusyId(order.id);
      setError("");
      setMsg("");
      const res = await api("/api/payments/sslcommerz/init/", {
        method: "POST",
        body: JSON.stringify({
          order_id: order.id,
          name: form.name || user?.username || "",
          phone: form.phone || "",
          address: form.address || "",
        }),
      });
      const url = res?.gateway_url;
      if (!url) throw new Error("Payment gateway URL not found");
      window.location.href = url;
    } catch (e) {
      setError(e?.message || "Payment init failed");
    } finally {
      setBusyId(null);
    }
  };

  const completedCount = orders.filter((o) => String(o.status).toUpperCase() === "COMPLETED").length;
  const awaitingPaymentCount = orders.filter((o) => String(o.status).toUpperCase() === "AWAITING_PAYMENT").length;

  if (!user) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-base-content/70">Please login.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Buyer Dashboard</h1>
          <p className="text-base-content/70">Request service, review seller updates, then pay after accept.</p>
        </div>

        <Link to="/services" className="btn btn-primary">
          Browse services <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-base-100 border border-base-200 p-5 shadow-sm">
          <div className="text-sm text-base-content/70">Total orders</div>
          <div className="text-3xl font-extrabold mt-1">{orders.length}</div>
        </div>
        <div className="rounded-3xl bg-base-100 border border-base-200 p-5 shadow-sm">
          <div className="text-sm text-base-content/70">Awaiting payment</div>
          <div className="text-3xl font-extrabold mt-1">{awaitingPaymentCount}</div>
        </div>
        <div className="rounded-3xl bg-base-100 border border-base-200 p-5 shadow-sm">
          <div className="text-sm text-base-content/70">Completed</div>
          <div className="text-3xl font-extrabold mt-1">{completedCount}</div>
        </div>
      </div>

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

      {msg ? <div className="alert alert-success"><span>{msg}</span></div> : null}
      {error ? <div className="alert alert-error"><span>{error}</span></div> : null}

      {loading ? (
        <Card>
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="loading loading-spinner loading-sm" />
            Loading your orders...
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((o) => {
            const form = paymentForm[o.id] || { name: user?.username || "", phone: "", address: "" };
            const isBusy = busyId === o.id;

            return (
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
                actions={<div className={`badge ${statusBadge(o.status)} badge-outline font-semibold`}>{o.status || "—"}</div>}
              >
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="text-base-content/70">
                    Seller: <span className="font-medium text-base-content">{o.seller?.username || "—"}</span>
                  </div>
                  <div className="text-base-content/70 sm:text-right">
                    Created: <span className="font-medium text-base-content">{o.created_at ? new Date(o.created_at).toLocaleString() : "—"}</span>
                  </div>
                </div>

                {o.buyer_requirements ? (
                  <div className="rounded-2xl bg-base-200 p-4 text-sm">
                    <div className="text-xs text-base-content/60 mb-1">Your requirements</div>
                    <div className="text-base-content/80">{o.buyer_requirements}</div>
                  </div>
                ) : null}

                {o.seller_update_message ? (
                  <div className="rounded-2xl bg-base-200 p-4 text-sm">
                    <div className="text-xs text-base-content/60 mb-1">Seller update</div>
                    <div className="text-base-content/80">{o.seller_update_message}</div>
                  </div>
                ) : null}

                {o.buyer_response_note ? (
                  <div className="rounded-2xl bg-base-200 p-4 text-sm">
                    <div className="text-xs text-base-content/60 mb-1">Your last response</div>
                    <div className="text-base-content/80">{o.buyer_response_note}</div>
                  </div>
                ) : null}

                {o.status === "SELLER_UPDATED" ? (
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-success btn-sm" disabled={isBusy} onClick={() => reviewOrder(o.id, "accept")}>
                      Accept
                    </button>
                    <button className="btn btn-error btn-sm" disabled={isBusy} onClick={() => reviewOrder(o.id, "reject")}>
                      Reject
                    </button>
                  </div>
                ) : null}

                {o.status === "AWAITING_PAYMENT" ? (
                  <div className="space-y-3 rounded-2xl border border-base-200 p-4">
                    <div className="font-semibold">Payment info</div>
                    <input
                      className="input input-bordered w-full"
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => updatePaymentField(o.id, "name", e.target.value)}
                    />
                    <input
                      className="input input-bordered w-full"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={(e) => updatePaymentField(o.id, "phone", e.target.value)}
                    />
                    <textarea
                      className="textarea textarea-bordered w-full"
                      rows={3}
                      placeholder="Address"
                      value={form.address}
                      onChange={(e) => updatePaymentField(o.id, "address", e.target.value)}
                    />
                    <button className="btn btn-primary btn-sm" disabled={isBusy} onClick={() => payNow(o)}>
                      {isBusy ? "Redirecting..." : "Pay Now"}
                    </button>
                  </div>
                ) : null}
              </Card>
            );
          })}

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