import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../ui/Card";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";
import { Star, Clock, User, ShoppingCart, MessageSquareText, ArrowRight, ShieldCheck, BadgeCheck } from "lucide-react";

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
      <div className="mx-auto max-w-7xl px-4 py-12">
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
      <div className="mx-auto max-w-7xl px-4 py-12">
        <Card>
          <div className="text-base-content/70">Service not found.</div>
          <Link to="/services" className="btn btn-sm btn-primary mt-4 rounded-2xl w-fit">
            Back to services
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-base-200 bg-base-100 shadow-sm">
          <div className="border-b border-base-200 bg-base-200/50 px-6 py-4 text-sm text-base-content/65 sm:px-8">
            Marketplace / Services / <span className="font-semibold text-base-content">{service.title}</span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/65">
                  <span className="badge badge-outline rounded-full px-3 py-3">{service.category || "—"}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5">
                    <Clock size={14} /> {service.delivery_time_days ?? "—"} days
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5">
                    <User size={14} /> {service.seller?.username || "Seller"}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-black leading-tight text-base-content sm:text-4xl">{service.title}</h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-base-content/72">{service.description}</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-warning/15 px-4 py-2 text-sm font-semibold text-base-content">
                    <Star size={15} className="text-warning" />
                    {avgRating ? avgRating.toFixed(1) : "New"}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-base-200 px-4 py-2 text-sm text-base-content/70">
                    {reviews.length ? `${reviews.length} review${reviews.length > 1 ? "s" : ""}` : "No reviews yet"}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-base-200 bg-base-200/70 p-5 text-left md:min-w-[220px] md:text-right">
                <div className="text-sm text-base-content/55">Starting at</div>
                <div className="mt-1 text-4xl font-black text-primary">${service.price}</div>
                <p className="mt-2 text-xs leading-6 text-base-content/60">
                  Request first, then seller decision, then update review, and payment afterwards.
                </p>
              </div>
            </div>

            {service.requirements ? (
              <div className="mt-8 rounded-[28px] border border-base-200 bg-base-200/70 p-5 sm:p-6">
                <div className="flex items-center gap-2 text-base-content">
                  <BadgeCheck size={18} />
                  <div className="text-lg font-bold">Seller requirements</div>
                </div>
                <div className="mt-3 text-sm leading-7 text-base-content/75">{service.requirements}</div>
              </div>
            ) : null}
          </div>
        </section>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-base-content">Reviews</h2>
              <p className="mt-1 text-sm text-base-content/65">Feedback shared by previous buyers.</p>
            </div>
            <div className="badge badge-outline rounded-full px-3 py-3">{reviews.length}</div>
          </div>

          <div className="mt-6 grid gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-[24px] border border-base-200 bg-base-200/55 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-base font-bold text-base-content">{r.buyer?.username || "Buyer"}</div>
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-base-100 px-3 py-1.5 text-sm font-medium text-base-content/70">
                      <Star size={14} className="text-warning" /> {r.rating}/5
                    </div>
                  </div>
                  <div className="badge badge-outline rounded-full">{service.category || "—"}</div>
                </div>
                <div className="mt-4 text-sm leading-7 text-base-content/75">{r.comment || "—"}</div>
              </div>
            ))}

            {reviews.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-base-300 p-6 text-sm text-base-content/70">
                No reviews yet.
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-black text-base-content">Request this service</div>
              <p className="mt-1 text-sm text-base-content/65">A cleaner request summary without changing the flow.</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingCart size={20} />
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-base-200 bg-base-200/70 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-base-content">
              <ShieldCheck size={16} />
              How the process works
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-base-content/72">
              <li>1. Buyer sends service request with requirements.</li>
              <li>2. Seller accepts or rejects the request first.</li>
              <li>3. Seller sends update or work progress.</li>
              <li>4. Buyer reviews and accepts or requests changes.</li>
              <li>5. Payment unlocks after buyer approval.</li>
            </ul>
          </div>

          {role === "BUYER" ? (
            <button onClick={goRequest} className="btn btn-primary mt-5 w-full rounded-2xl shadow-sm">
              Send Request <ArrowRight size={16} />
            </button>
          ) : (
            <div className="mt-5 rounded-[24px] border border-base-200 bg-base-200/50 p-5 text-sm text-base-content/72">
              Login as <b>Buyer</b> to request this service.
              <div className="mt-4 flex gap-2">
                <Link to="/login" className="btn btn-outline btn-sm rounded-2xl">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm rounded-2xl">Register</Link>
              </div>
            </div>
          )}

          {msg ? (
            <div className={`mt-4 alert ${msgType === "success" ? "alert-success" : msgType === "error" ? "alert-error" : ""}`}>
              <span>{msg}</span>
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-2 text-xs text-base-content/60">
            <MessageSquareText size={14} className="opacity-70" />
            Request note will be collected on the next page.
          </div>
        </Card>
      </div>
    </div>
  );
}