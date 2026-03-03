import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../ui/Card";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

export default function Checkout() {
  const { id } = useParams(); // serviceId
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [buyerRequirements, setBuyerRequirements] = useState("");

  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const s = await api(`/api/services/${id}/`, { method: "GET" });
        setService(s);
      } catch (e) {
        setService(null);
        setError("Service not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const startPayment = async () => {
    setError("");

    if (!user) return navigate("/login");
    if (user.role !== "BUYER") return setError("Please login as BUYER to checkout.");

    if (!name.trim()) return setError("Name is required");
    if (!phone.trim()) return setError("Phone is required");
    if (!address.trim()) return setError("Address is required");

    setPaying(true);
    try {
      const res = await api("/api/payments/sslcommerz/init/", {
        method: "POST",
        body: JSON.stringify({
          service_id: Number(id),
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          buyer_requirements: buyerRequirements.trim(),
        }),
      });

      const url = res?.gateway_url;
      if (!url) throw new Error("Payment gateway URL not found");
      window.location.href = url; // ✅ redirect to SSLCOMMERZ
    } catch (e) {
      setError(e?.message || "Payment init failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Card>
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="loading loading-spinner loading-sm" />
            Loading checkout...
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
        <Card title="Checkout">
          {error ? (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          ) : null}

          <div className="grid gap-4">
            <div>
              <label className="label">
                <span className="label-text">Full name</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Order requirements (optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={3}
                value={buyerRequirements}
                onChange={(e) => setBuyerRequirements(e.target.value)}
                placeholder="Any additional info for the seller..."
              />
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={startPayment}
              disabled={paying}
            >
              {paying ? "Redirecting..." : "Pay Now (SSLCOMMERZ)"}
            </button>
          </div>
        </Card>
      </div>

      <div>
        <Card title="Order Summary">
          <div className="space-y-2">
            <div className="font-bold text-lg">{service.title}</div>
            <div className="text-base-content/70">Category: {service.category}</div>
            <div className="text-base-content/70">Delivery: {service.delivery_time_days} days</div>

            <div className="divider my-3" />

            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-extrabold">${service.price}</span>
            </div>

            <div className="text-xs text-base-content/60 mt-2">
              After payment success, your order will appear in Buyer Dashboard.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}