import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../ui/Card";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

export default function ServiceDetail() {
  const { id } = useParams();
  const { me } = useAuth();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reqText, setReqText] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get(`/api/services/${id}/`).then(r => setService(r.data)).catch(()=>setService(null));
    api.get(`/api/services/${id}/reviews/`).then(r => setReviews(r.data)).catch(()=>setReviews([]));
  }, [id]);

  const placeOrder = async () => {
    setMsg("");
    try {
      const r = await api.post("/api/orders/create/", { service_id: Number(id), buyer_requirements: reqText });
      setMsg("✅ Order placed! Check your Buyer Dashboard.");
      setReqText("");
    } catch (e) {
      const detail = e?.response?.data?.detail || "Failed. Make sure you are logged in as Buyer and your email is verified.";
      setMsg(String(detail));
    }
  };

  if (!service) return <div className="mx-auto max-w-6xl px-4 py-8 text-slate-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <div className="text-sm text-slate-500">{service.category} • {service.delivery_time_days} days</div>
          <div className="text-2xl font-bold">{service.title}</div>
          <div className="mt-2 text-slate-700">{service.description}</div>

          {service.requirements && (
            <div className="mt-4 rounded-lg border bg-slate-50 p-3">
              <div className="text-sm font-semibold">Requirements</div>
              <div className="text-sm text-slate-700">{service.requirements}</div>
            </div>
          )}

          <div className="mt-4 text-xs text-slate-500">Seller: {service.seller?.username}</div>
        </Card>

        <div className="mt-4">
          <Card>
            <div className="font-semibold mb-2">Reviews</div>
            <div className="grid gap-3">
              {reviews.map(r => (
                <div key={r.id} className="rounded-lg border p-3">
                  <div className="text-sm"><b>{r.rating}/5</b> • by {r.buyer?.username}</div>
                  <div className="text-sm text-slate-700">{r.comment || "—"}</div>
                </div>
              ))}
              {reviews.length === 0 && <div className="text-sm text-slate-500">No reviews yet.</div>}
            </div>
          </Card>
        </div>
      </div>

      <div className="md:col-span-1">
        <Card>
          <div className="text-xs text-slate-500">Price</div>
          <div className="text-3xl font-bold">${service.price}</div>

          {me?.profile?.role === "BUYER" ? (
            <>
              <div className="mt-3 text-sm font-semibold">Place Order</div>
              <textarea value={reqText} onChange={e=>setReqText(e.target.value)}
                placeholder="Tell the seller what you need..."
                className="mt-2 w-full rounded-md border p-2 text-sm" rows={5} />
              <button onClick={placeOrder}
                className="mt-3 w-full rounded-md bg-slate-900 px-3 py-2 text-white hover:bg-slate-800">
                Place Order
              </button>
            </>
          ) : (
            <div className="mt-3 text-sm text-slate-600">
              Login as <b>Buyer</b> to place order.
              <div className="mt-2 flex gap-2">
                <Link to="/login" className="rounded-md border px-3 py-1.5 hover:bg-slate-50">Login</Link>
                <Link to="/register" className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800">Register</Link>
              </div>
            </div>
          )}

          {msg && <div className="mt-3 text-sm text-slate-700">{msg}</div>}
        </Card>
      </div>
    </div>
  );
}
