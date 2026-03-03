import { Link, useLocation } from "react-router-dom";
import Card from "../ui/Card";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PaymentResult({ status }) {
  const q = useQuery();
  const tranId = q.get("tran_id") || "";
  const orderId = q.get("order_id") || "";

  const map = {
    success: {
      title: "✅ Payment Successful",
      desc: "Your payment was successful. Your order is now in progress.",
      badge: "badge-success",
    },
    fail: {
      title: "❌ Payment Failed",
      desc: "Your payment failed. Please try again.",
      badge: "badge-error",
    },
    cancel: {
      title: "⚠️ Payment Cancelled",
      desc: "You cancelled the payment.",
      badge: "badge-warning",
    },
  };

  const m = map[status] || map.fail;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card>
        <div className={`badge ${m.badge} mb-3`}>{status.toUpperCase()}</div>
        <h1 className="text-2xl font-bold">{m.title}</h1>
        <p className="text-base-content/70 mt-2">{m.desc}</p>

        {(tranId || orderId) && (
          <div className="mt-4 text-sm text-base-content/70">
            <div>Transaction: <b>{tranId || "—"}</b></div>
            <div>Order ID: <b>{orderId || "—"}</b></div>
          </div>
        )}

        <div className="mt-6 flex gap-2 flex-wrap">
          <Link to="/buyer" className="btn btn-primary">
            Go to Buyer Dashboard
          </Link>
          <Link to="/services" className="btn btn-ghost">
            Back to Services
          </Link>
        </div>
      </Card>
    </div>
  );
}