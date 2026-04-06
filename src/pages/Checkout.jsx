import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../ui/Card";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";
import { ArrowRight, ClipboardList, ShieldCheck } from "lucide-react";

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyerRequirements, setBuyerRequirements] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const s = await api(`/api/services/${id}/`, { method: "GET" });
        setService(s);
      } catch {
        setService(null);
        setError("Service not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submitRequest = async () => {
    setError("");

    if (!user) return navigate("/login");
    if (user.role !== "BUYER") return setError("Please login as BUYER to request this service.");

    setSubmitting(true);
    try {
      await api("/api/orders/create/", {
        method: "POST",
        body: JSON.stringify({
          service_id: Number(id),
          buyer_requirements: buyerRequirements.trim(),
        }),
      });

      navigate("/buyer", {
        state: {
          success: "Request sent successfully. Seller will first accept or reject your request.",
        },
      });
    } catch (e) {
      setError(e?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Card>
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="loading loading-spinner loading-sm" />
            Loading request form...
          </div>
        </Card>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Card>
          <div className="text-base-content/70">{error || "Service not found"}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <div>
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <ClipboardList size={15} /> Service request
              </div>
              <h1 className="mt-4 text-3xl font-black text-base-content">Send request to seller</h1>
              <p className="mt-2 text-base-content/70">Write your requirements clearly so the seller can review and respond.</p>
            </div>
          </div>

          {error ? (
            <div className="alert alert-error mt-6">
              <span>{error}</span>
            </div>
          ) : null}

          <div className="mt-6 rounded-[24px] border border-base-200 bg-base-200/70 p-5 text-sm leading-7 text-base-content/72">
            Buyer sends request first. Seller accepts or rejects. If accepted, seller sends update. Buyer reviews the update, and payment unlocks only after buyer approval.
          </div>

          <div className="mt-6">
            <label className="label">
              <span className="label-text text-sm font-semibold">Project requirements / instructions</span>
            </label>
            <textarea
              className="textarea textarea-bordered min-h-[180px] w-full rounded-[24px] bg-base-100"
              value={buyerRequirements}
              onChange={(e) => setBuyerRequirements(e.target.value)}
              placeholder="Describe exactly what you want from the seller..."
            />
          </div>

          <button className="btn btn-primary mt-6 w-full rounded-2xl shadow-sm" onClick={submitRequest} disabled={submitting}>
            {submitting ? "Sending request..." : <>Send Request <ArrowRight size={16} /></>}
          </button>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-xl font-black text-base-content">Request Summary</div>
              <div className="text-sm text-base-content/65">Selected service overview</div>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-base-200 bg-base-200/70 p-5 space-y-3">
            <div>
              <div className="text-sm text-base-content/55">Service</div>
              <div className="mt-1 text-xl font-black text-base-content">{service.title}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm text-base-content/55">Category</div>
                <div className="mt-1 font-semibold text-base-content">{service.category}</div>
              </div>
              <div>
                <div className="text-sm text-base-content/55">Delivery</div>
                <div className="mt-1 font-semibold text-base-content">{service.delivery_time_days} days</div>
              </div>
            </div>
            <div className="border-t border-base-300 pt-3 flex items-center justify-between">
              <span className="font-semibold text-base-content">Price</span>
              <span className="text-3xl font-black text-primary">${service.price}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-lg font-black text-base-content">Important note</div>
          <p className="mt-3 text-sm leading-7 text-base-content/72">
            Payment does not happen on this page. The buyer will be able to pay only after the seller responds and the buyer accepts the seller update.
          </p>
        </Card>
      </div>
    </div>
  );
}