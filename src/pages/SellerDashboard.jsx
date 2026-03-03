import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

export default function SellerDashboard() {
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const loadMyServices = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const data = await api("/api/services/mine/", { method: "GET" });
      const list = Array.isArray(data) ? data : data?.results || [];
      setServices(list);
    } catch (e) {
      setServices([]);
      setError(e?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username]);

  const addService = async () => {
    try {
      setError("");
      if (!title.trim()) return setError("Title is required");
      if (!price || isNaN(Number(price))) return setError("Valid price is required");

      await api("/api/services/", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          price: Number(price),
          description: "New service",
          requirements: "",
          category: "General",
          delivery_time_days: 3,
        }),
      });

      setTitle("");
      setPrice("");
      await loadMyServices();
    } catch (e) {
      setError(e?.message || "Failed to create service");
    }
  };

  const deleteService = async (id) => {
    try {
      setError("");
      await api(`/api/services/${id}/manage/`, { method: "DELETE" });
      await loadMyServices();
    } catch (e) {
      setError(e?.message || "Failed to delete service");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      <div className="flex gap-4 items-end mb-6">
        <div className="flex-1">
          <label className="label"><span className="label-text">Title</span></label>
          <input
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Service title"
          />
        </div>

        <div className="w-56">
          <label className="label"><span className="label-text">Price</span></label>
          <input
            className="input input-bordered w-full"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 50"
          />
        </div>

        <button className="btn btn-primary" onClick={addService}>
          Add
        </button>
      </div>

      {error ? (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      ) : null}

      {loading ? (
        <p className="opacity-70">Loading...</p>
      ) : (
        <div className="space-y-3">
          {services.length === 0 ? (
            <p className="opacity-70">No services yet.</p>
          ) : (
            services.map((s) => (
              <div key={s.id} className="card bg-base-100 shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{s.title}</h3>
                    <p className="opacity-70">${s.price}</p>
                  </div>
                  <button className="btn btn-error btn-sm" onClick={() => deleteService(s.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}