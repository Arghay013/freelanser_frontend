import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../ui/Card";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

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
      <div className="max-w-5xl mx-auto px-4 py-12">
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
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Card>
          <div className="text-base-content/70">{error || "Service not found"}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <div className="text-xl font-bold mb-4">Send Service Request</div>

          {error ? (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          ) : null}

          <div className="grid gap-4">
            <div className="rounded-2xl bg-base-200 p-4 text-sm text-base-content/80">
              আগে request যাবে। তারপর seller accept বা reject করবে। seller accept করলে seller update দিবে।
              এরপর buyer accept বা reject করবে। buyer accept করার পরে payment option unlock হবে।
            </div>

            <div>
              <label className="label">
                <span className="label-text">Project requirements / instructions</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={6}
                value={buyerRequirements}
                onChange={(e) => setBuyerRequirements(e.target.value)}
                placeholder="Write what you want from the seller..."
              />
            </div>

            <button className="btn btn-primary w-full" onClick={submitRequest} disabled={submitting}>
              {submitting ? "Sending request..." : "Send Request"}
            </button>
          </div>
        </Card>
      </div>

      <div>
        <Card>
          <div className="text-xl font-bold mb-4">Request Summary</div>

          <div className="space-y-2">
            <div className="font-bold text-lg">{service.title}</div>
            <div className="text-base-content/70">Category: {service.category}</div>
            <div className="text-base-content/70">Delivery: {service.delivery_time_days} days</div>
            <div className="divider my-3" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Price</span>
              <span className="text-xl font-extrabold">${service.price}</span>
            </div>
            <div className="text-xs text-base-content/60 mt-2">
              Note: payment এখনই হবে না। seller accept করার পর seller update submit করবে।
              buyer accept করলে তারপর payment করা যাবে।
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}