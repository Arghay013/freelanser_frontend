import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../ui/Card";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";
import { Star, Clock, User, ShoppingCart, MessageSquareText } from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reqText, setReqText] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const s = await api(`/api/services/${id}/`, { method: "GET" });
        setService(s || null);
      } catch {
        setService(null);
      }

      try {
        const r = await api(`/api/services/${id}/reviews/`, { method: "GET" });
        const list = Array.isArray(r) ? r : (r?.results || []);
        setReviews(list);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((a, x) => a + Number(x.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const placeOrder = async () => {
    setMsg("");
    setPlacing(true);
    try {
      await api("/api/orders/create/", {
        method: "POST",
        body: JSON.stringify({ service_id: Number(id), buyer_requirements: reqText }),
      });
      setMsg("✅ Order placed! Check your Buyer Dashboard.");
      setReqText("");
    } catch (e) {
      const detail =
        e?.message ||
        "Failed. Make sure you are logged in as Buyer and your email is verified.";
      setMsg(String(detail));
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Card>
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="loading loading-spinner loading-sm" />
            Loading service...
          </div>
        </Card>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Card>
          <div className="text-base-content/70">Service not found.</div>
          <Link to="/services" className="btn btn-sm btn-primary mt-3 w-fit">
            Back to services
          </Link>
        </Card>
      </div>
    );
  }

  const role = user?.role;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 grid gap-5 lg:grid-cols-3">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-5">
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/70">
                <span className="badge badge-outline">{service.category || "General"}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} /> {service.delivery_time_days ?? "—"} days
                </span>
                <span className="inline-flex items-center gap-1">
                  <User size={14} /> {service.seller?.username || "Seller"}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold mt-3">{service.title}</h1>
              <p className="text-base-content/70 mt-2 leading-relaxed">
                {service.description}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <div className="badge badge-primary badge-outline">
                  <Star size={14} className="mr-1" />
                  {avgRating ? avgRating.toFixed(1) : "New"}
                </div>
                <div className="text-sm text-base-content/60">
                  {reviews.length ? `${reviews.length} reviews` : "No reviews yet"}
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-base-content/60">Starting at</div>
              <div className="text-4xl font-extrabold">${service.price}</div>
              <div className="text-xs text-base-content/60 mt-1">Secure order • Clear status</div>
            </div>
          </div>

          {service.requirements && (
            <div className="mt-5 rounded-2xl bg-base-200 p-5">
              <div className="text-sm font-semibold">Requirements</div>
              <div className="text-sm text-base-content/80 mt-2 leading-relaxed">
                {service.requirements}
              </div>
            </div>
          )}
        </Card>

        {/* REVIEWS */}
        <Card title="Reviews">
          <div className="grid gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-base-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-bold">{r.rating}/5</span>{" "}
                    <span className="text-base-content/60">by</span>{" "}
                    <span className="font-medium">{r.buyer?.username || "Buyer"}</span>
                  </div>
                  <span className="badge badge-outline">{service.category || "General"}</span>
                </div>
                <div className="text-sm text-base-content/80 mt-2">
                  {r.comment || "—"}
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-sm text-base-content/70">No reviews yet.</div>
            )}
          </div>
        </Card>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-1">
        <Card
          title="Place order"
          actions={<ShoppingCart size={18} className="opacity-70" />}
        >
          {role === "BUYER" ? (
            <>
              <div className="text-sm text-base-content/70">
                Add a short note for the seller (requirements, references, etc.)
              </div>

              <label className="form-control mt-3">
                <div className="label">
                  <span className="label-text flex items-center gap-2">
                    <MessageSquareText size={16} /> Your note
                  </span>
                </div>
                <textarea
                  value={reqText}
                  onChange={(e) => setReqText(e.target.value)}
                  placeholder="Tell the seller what you need..."
                  className="textarea textarea-bordered min-h-[140px]"
                />
              </label>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="btn btn-primary w-full mt-4"
              >
                {placing ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Placing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              <div className="mt-3 text-xs text-base-content/60">
                Tip: Check Buyer Dashboard after placing order.
              </div>
            </>
          ) : (
            <div className="text-sm text-base-content/70">
              Login as <b>Buyer</b> to place order.
              <div className="mt-3 flex gap-2">
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            </div>
          )}

          {msg && (
            <div className="mt-4 alert">
              <span>{msg}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}