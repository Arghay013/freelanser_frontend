import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../ui/Card";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";
import { Star, Clock, User, ShoppingCart, MessageSquareText, ArrowRight } from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");

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
        const list = Array.isArray(r) ? r : r?.results || [];
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

  const role = user?.role || user?.profile?.role;

  const goRequest = () => {
    setMsg("");
    setMsgType("info");

    if (!user) {
      setMsgType("error");
      setMsg("Please login first to request this service.");
      return;
    }

    if (role !== "BUYER") {
      setMsgType("error");
      setMsg("Login as BUYER to request this service.");
      return;
    }

    navigate(`/checkout/${id}`);
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/70">
                <span className="badge badge-outline">{service.category || "—"}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} /> {service.delivery_time_days ?? "—"} days
                </span>
                <span className="inline-flex items-center gap-1">
                  <User size={14} /> {service.seller?.username || "Seller"}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold mt-3">{service.title}</h1>
              <p className="text-base-content/70 mt-2 leading-relaxed">{service.description}</p>

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
              <div className="text-xs text-base-content/60 mt-1">Request first • Review update • Pay after accept</div>
            </div>
          </div>

          {service.requirements && (
            <div className="mt-5 rounded-2xl bg-base-200 p-5">
              <div className="text-sm font-semibold">Seller Requirements</div>
              <div className="text-sm text-base-content/80 mt-2 leading-relaxed">{service.requirements}</div>
            </div>
          )}
        </Card>

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
                  <span className="badge badge-outline">{service.category || "—"}</span>
                </div>
                <div className="text-sm text-base-content/80 mt-2">{r.comment || "—"}</div>
              </div>
            ))}

            {reviews.length === 0 && <div className="text-sm text-base-content/70">No reviews yet.</div>}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card title="Request service" actions={<ShoppingCart size={18} className="opacity-70" />}>
          {role === "BUYER" ? (
            <>
              <div className="text-sm text-base-content/70">
                এখানে buyer আগে request করবে। seller update দিবে। তারপর buyer accept or reject করবে।
                accept করার পরেই payment unlock হবে.
              </div>

              <div className="mt-4 rounded-2xl bg-base-200 p-4">
                <div className="text-sm font-semibold">What happens next?</div>
                <ul className="text-sm text-base-content/70 mt-2 space-y-1 list-disc list-inside">
                  <li>You send your request and requirements</li>
                  <li>Seller sends an update for your review</li>
                  <li>You accept or reject the update</li>
                  <li>After accept, you pay via SSLCOMMERZ</li>
                </ul>
              </div>

              <button onClick={goRequest} className="btn btn-primary w-full mt-4">
                Send Request <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <div className="text-sm text-base-content/70">
              Login as <b>Buyer</b> to request this service.
              <div className="mt-3 flex gap-2">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            </div>
          )}

          {msg && (
            <div className={`mt-4 alert ${msgType === "success" ? "alert-success" : msgType === "error" ? "alert-error" : ""}`}>
              <span>{msg}</span>
            </div>
          )}

          <div className="mt-4 text-xs text-base-content/60 flex items-center gap-2">
            <MessageSquareText size={14} className="opacity-70" />
            Request note will be collected on the next page.
          </div>
        </Card>
      </div>
    </div>
  );
}