import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

export default function SellerDashboard() {
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("programming");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [updateTexts, setUpdateTexts] = useState({});

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const [servicesData, ordersData] = await Promise.all([
        api("/api/services/mine/", { method: "GET" }),
        api("/api/orders/seller/", { method: "GET" }),
      ]);
      setServices(Array.isArray(servicesData) ? servicesData : servicesData?.results || []);
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData?.results || []);
    } catch (e) {
      setError(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.username]);

  const addService = async () => {
    try {
      setError("");
      setMsg("");

      if (!title.trim()) return setError("Title is required");
      if (!price || isNaN(Number(price))) return setError("Valid price required");

      await api("/api/services/", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          price: Number(price),
          description: "New service",
          requirements: "",
          category,
          delivery_time_days: 3,
        }),
      });

      setTitle("");
      setPrice("");
      setCategory("programming");
      setMsg("Service added successfully");
      await loadData();
    } catch (e) {
      setError(e?.message || "Failed to create service");
    }
  };

  const deleteService = async (id) => {
    try {
      setError("");
      setMsg("");
      await api(`/api/services/${id}/manage/`, { method: "DELETE" });
      setMsg("Service deleted");
      await loadData();
    } catch (e) {
      setError(e?.message || "Delete failed");
    }
  };

  const sendSellerUpdate = async (orderId) => {
    const message = (updateTexts[orderId] || "").trim();
    if (!message) return setError("Update message is required");

    try {
      setBusyId(orderId);
      setError("");
      setMsg("");
      await api(`/api/orders/${orderId}/seller-update/`, {
        method: "PUT",
        body: JSON.stringify({ seller_update_message: message }),
      });
      setUpdateTexts((prev) => ({ ...prev, [orderId]: "" }));
      setMsg("Update sent to buyer");
      await loadData();
    } catch (e) {
      setError(e?.message || "Failed to send update");
    } finally {
      setBusyId(null);
    }
  };

  const markCompleted = async (orderId) => {
    try {
      setBusyId(orderId);
      setError("");
      setMsg("");
      await api(`/api/orders/${orderId}/status/`, {
        method: "PUT",
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      setMsg("Order marked as completed");
      await loadData();
    } catch (e) {
      setError(e?.message || "Failed to update order");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
        <p className="text-base-content/70">Manage services and respond to buyer requests.</p>
      </div>

      {msg ? (
        <div className="alert alert-success">
          <span>{msg}</span>
        </div>
      ) : null}

      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : null}

      <div className="card bg-base-100 shadow p-5">
        <h2 className="text-xl font-bold mb-4">Add Service</h2>
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="label"><span className="label-text">Title</span></label>
            <input className="input input-bordered w-full" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Service title" />
          </div>

          <div className="w-40">
            <label className="label"><span className="label-text">Price</span></label>
            <input className="input input-bordered w-full" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="50" />
          </div>

          <div className="w-52">
            <label className="label"><span className="label-text">Category</span></label>
            <select className="select select-bordered w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="programming">Programming</option>
              <option value="marketing">Marketing</option>
              <option value="video">Video Editing</option>
              <option value="graphic">Graphic Design</option>
              <option value="writing">Writing</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={addService}>Add</button>
        </div>
      </div>

      <div className="card bg-base-100 shadow p-5">
        <h2 className="text-xl font-bold mb-4">Buyer Requests</h2>

        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-base-content/70">No buyer requests yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="border border-base-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold">{o.service?.title}</h3>
                    <p className="text-sm opacity-70">Buyer: {o.buyer?.username}</p>
                  </div>
                  <div className="badge badge-outline">{o.status}</div>
                </div>

                {o.buyer_requirements ? (
                  <div className="rounded-xl bg-base-200 p-3 text-sm">
                    <div className="font-semibold mb-1">Buyer requirements</div>
                    <div>{o.buyer_requirements}</div>
                  </div>
                ) : null}

                {o.seller_update_message ? (
                  <div className="rounded-xl bg-base-200 p-3 text-sm">
                    <div className="font-semibold mb-1">Last seller update</div>
                    <div>{o.seller_update_message}</div>
                  </div>
                ) : null}

                {o.buyer_response_note ? (
                  <div className="rounded-xl bg-base-200 p-3 text-sm">
                    <div className="font-semibold mb-1">Buyer response note</div>
                    <div>{o.buyer_response_note}</div>
                  </div>
                ) : null}

                {["REQUESTED", "CHANGES_REQUESTED"].includes(o.status) ? (
                  <div className="space-y-2">
                    <textarea
                      className="textarea textarea-bordered w-full"
                      rows={4}
                      placeholder="Write your update for buyer..."
                      value={updateTexts[o.id] || ""}
                      onChange={(e) => setUpdateTexts((prev) => ({ ...prev, [o.id]: e.target.value }))}
                    />
                    <button className="btn btn-primary btn-sm" disabled={busyId === o.id} onClick={() => sendSellerUpdate(o.id)}>
                      {busyId === o.id ? "Sending..." : "Send Update"}
                    </button>
                  </div>
                ) : null}

                {o.status === "IN_PROGRESS" ? (
                  <button className="btn btn-success btn-sm" disabled={busyId === o.id} onClick={() => markCompleted(o.id)}>
                    Mark Completed
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card bg-base-100 shadow p-5">
        <h2 className="text-xl font-bold mb-4">My Services</h2>

        {loading ? (
          <p>Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-base-content/70">No services yet.</p>
        ) : (
          <div className="space-y-3">
            {services.map((s) => (
              <div key={s.id} className="card bg-base-200 shadow-sm p-4">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <h3 className="font-bold">{s.title}</h3>
                    <p>${s.price}</p>
                    <p className="text-sm opacity-70">{s.category}</p>
                  </div>
                  <button className="btn btn-error btn-sm" onClick={() => deleteService(s.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}