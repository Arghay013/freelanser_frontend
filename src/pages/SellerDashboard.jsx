import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";
import {
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  Package,
  Plus,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";

const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "REQUESTED") return "badge-info";
  if (s === "REQUEST_ACCEPTED") return "badge-primary";
  if (s === "REQUEST_REJECTED") return "badge-error";
  if (s === "SELLER_UPDATED") return "badge-secondary";
  if (s === "CHANGES_REQUESTED") return "badge-warning";
  if (s === "AWAITING_PAYMENT") return "badge-accent";
  if (s === "IN_PROGRESS") return "badge-success";
  if (s === "COMPLETED") return "badge-success";
  return "badge-ghost";
};

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

  const [decisionTexts, setDecisionTexts] = useState({});
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

  const stats = useMemo(() => {
    const requested = orders.filter((o) => String(o.status).toUpperCase() === "REQUESTED").length;
    const inProgress = orders.filter((o) => String(o.status).toUpperCase() === "IN_PROGRESS").length;
    const completed = orders.filter((o) => String(o.status).toUpperCase() === "COMPLETED").length;
    return { requested, inProgress, completed };
  }, [orders]);

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

  const decideRequest = async (orderId, action) => {
    const note = (decisionTexts[orderId] || "").trim();

    try {
      setBusyId(orderId);
      setError("");
      setMsg("");

      await api(`/api/orders/${orderId}/seller-decision/`, {
        method: "PUT",
        body: JSON.stringify({
          action,
          seller_update_message: note,
        }),
      });

      setDecisionTexts((prev) => ({ ...prev, [orderId]: "" }));
      setMsg(action === "accept" ? "Buyer request accepted" : "Buyer request rejected");
      await loadData();
    } catch (e) {
      setError(e?.message || "Failed to update request");
    } finally {
      setBusyId(null);
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
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Seller Dashboard</h1>
          <p className="text-base-content/70">
            Buyer request আসার পরে আগে accept বা reject করো, তারপর কাজের update পাঠাও।
          </p>
        </div>
      </div>

      {msg ? (
        <div className="alert alert-success rounded-2xl">
          <span>{msg}</span>
        </div>
      ) : null}

      {error ? (
        <div className="alert alert-error rounded-2xl">
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-base-200 bg-base-100 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/60">New requests</div>
              <div className="mt-1 text-3xl font-extrabold">{stats.requested}</div>
            </div>
            <ClipboardList className="opacity-70" size={24} />
          </div>
        </div>

        <div className="rounded-3xl border border-base-200 bg-base-100 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/60">In progress</div>
              <div className="mt-1 text-3xl font-extrabold">{stats.inProgress}</div>
            </div>
            <Clock3 className="opacity-70" size={24} />
          </div>
        </div>

        <div className="rounded-3xl border border-base-200 bg-base-100 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/60">Completed</div>
              <div className="mt-1 text-3xl font-extrabold">{stats.completed}</div>
            </div>
            <CheckCircle2 className="opacity-70" size={24} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-md space-y-5">
        <div className="flex items-center gap-2">
          <Plus size={20} />
          <h2 className="text-xl font-bold">Add Service</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Service title"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <input
              className="input input-bordered w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="50"
            />
          </div>

          <div className="md:col-span-3">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="programming">Programming</option>
              <option value="marketing">Marketing</option>
              <option value="video">Video Editing</option>
              <option value="graphic">Graphic Design</option>
              <option value="writing">Writing</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button className="btn btn-primary w-full" onClick={addService}>
              Add Service
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-md space-y-5">
        <div className="flex items-center gap-2">
          <Package size={20} />
          <h2 className="text-xl font-bold">Buyer Requests</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="loading loading-spinner loading-sm" />
            Loading requests...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-base-200 p-5 text-base-content/70">No buyer requests yet.</div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => {
              const isBusy = busyId === o.id;
              const upperStatus = String(o.status || "").toUpperCase();

              return (
                <div
                  key={o.id}
                  className="rounded-3xl border border-base-200 bg-base-100 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold">{o.service?.title || "Service"}</h3>
                        <div className={`badge badge-outline ${statusBadge(o.status)} font-semibold`}>
                          {o.status}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-base-content/70 space-y-1">
                        <div>Buyer: <span className="font-medium text-base-content">{o.buyer?.username || "—"}</span></div>
                        <div>Created: <span className="font-medium text-base-content">{o.created_at ? new Date(o.created_at).toLocaleString() : "—"}</span></div>
                        <div>Price: <span className="font-medium text-base-content">${o.service?.price ?? "—"}</span></div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-base-200 px-4 py-3 text-sm text-base-content/70 max-w-md">
                      <div className="font-semibold text-base-content mb-1">Current flow</div>
                      <div>
                        Request → Seller accept/reject → Seller update → Buyer accept/reject → Payment → Work complete
                      </div>
                    </div>
                  </div>

                  {o.buyer_requirements ? (
                    <div className="rounded-2xl bg-base-200 p-4 text-sm">
                      <div className="font-semibold mb-1">Buyer requirements</div>
                      <div>{o.buyer_requirements}</div>
                    </div>
                  ) : null}

                  {o.seller_update_message ? (
                    <div className="rounded-2xl bg-base-200 p-4 text-sm">
                      <div className="font-semibold mb-1">
                        {upperStatus === "REQUEST_REJECTED" ? "Rejection note" : "Last seller note / update"}
                      </div>
                      <div>{o.seller_update_message}</div>
                    </div>
                  ) : null}

                  {o.buyer_response_note ? (
                    <div className="rounded-2xl bg-base-200 p-4 text-sm">
                      <div className="font-semibold mb-1">Buyer response note</div>
                      <div>{o.buyer_response_note}</div>
                    </div>
                  ) : null}

                  {upperStatus === "REQUESTED" ? (
                    <div className="space-y-3 rounded-2xl border border-base-200 p-4">
                      <div className="font-semibold">Accept or reject this buyer request</div>

                      <textarea
                        className="textarea textarea-bordered w-full"
                        rows={3}
                        placeholder="Optional note for buyer..."
                        value={decisionTexts[o.id] || ""}
                        onChange={(e) =>
                          setDecisionTexts((prev) => ({ ...prev, [o.id]: e.target.value }))
                        }
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          disabled={isBusy}
                          onClick={() => decideRequest(o.id, "accept")}
                        >
                          <CheckCircle2 size={16} />
                          {isBusy ? "Please wait..." : "Accept Request"}
                        </button>

                        <button
                          className="btn btn-error btn-sm"
                          disabled={isBusy}
                          onClick={() => decideRequest(o.id, "reject")}
                        >
                          <XCircle size={16} />
                          {isBusy ? "Please wait..." : "Reject Request"}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {["REQUEST_ACCEPTED", "CHANGES_REQUESTED"].includes(upperStatus) ? (
                    <div className="space-y-3 rounded-2xl border border-base-200 p-4">
                      <div className="font-semibold">
                        {upperStatus === "REQUEST_ACCEPTED"
                          ? "Request accepted. Now send your work/update to buyer."
                          : "Buyer asked for changes. Send updated work again."}
                      </div>

                      <textarea
                        className="textarea textarea-bordered w-full"
                        rows={4}
                        placeholder="Write your update for buyer..."
                        value={updateTexts[o.id] || ""}
                        onChange={(e) =>
                          setUpdateTexts((prev) => ({ ...prev, [o.id]: e.target.value }))
                        }
                      />

                      <button
                        className="btn btn-primary btn-sm"
                        disabled={isBusy}
                        onClick={() => sendSellerUpdate(o.id)}
                      >
                        <Send size={16} />
                        {isBusy ? "Sending..." : "Send Update"}
                      </button>
                    </div>
                  ) : null}

                  {upperStatus === "AWAITING_PAYMENT" ? (
                    <div className="rounded-2xl border border-base-200 p-4 text-sm text-base-content/70">
                      <div className="flex items-center gap-2 font-semibold text-base-content">
                        <CircleDollarSign size={18} />
                        Waiting for buyer payment
                      </div>
                      <div className="mt-2">
                        Buyer accepted your update. Payment complete হলেই order automatically work stage-এ যাবে।
                      </div>
                    </div>
                  ) : null}

                  {upperStatus === "IN_PROGRESS" ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        disabled={isBusy}
                        onClick={() => markCompleted(o.id)}
                      >
                        Mark Completed
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-md space-y-5">
        <div className="flex items-center gap-2">
          <Briefcase size={20} />
          <h2 className="text-xl font-bold">My Services</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="loading loading-spinner loading-sm" />
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl bg-base-200 p-5 text-base-content/70">No services yet.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((s) => (
              <div key={s.id} className="rounded-3xl border border-base-200 bg-base-100 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    <div className="mt-2 text-sm text-base-content/70 space-y-1">
                      <div>Category: <span className="font-medium text-base-content">{s.category}</span></div>
                      <div>Price: <span className="font-medium text-base-content">${s.price}</span></div>
                    </div>
                  </div>

                  <button className="btn btn-error btn-sm" onClick={() => deleteService(s.id)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}