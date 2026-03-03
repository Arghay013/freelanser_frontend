import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

export default function SellerDashboard() {
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("programming"); // ✅ default
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
  }, [user?.username]);

  const addService = async () => {
    try {
      setError("");

      if (!title.trim()) return setError("Title is required");
      if (!price || isNaN(Number(price)))
        return setError("Valid price required");

      await api("/api/services/", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          price: Number(price),
          description: "New service",
          requirements: "",
          category: category, // ✅ dynamic এখন
          delivery_time_days: 3,
        }),
      });

      setTitle("");
      setPrice("");
      setCategory("web"); // reset
      await loadMyServices();
    } catch (e) {
      setError(e?.message || "Failed to create service");
    }
  };

  const deleteService = async (id) => {
    try {
      await api(`/api/services/${id}/manage/`, { method: "DELETE" });
      await loadMyServices();
    } catch (e) {
      setError(e?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      <div className="flex gap-4 items-end mb-6 flex-wrap">
        {/* TITLE */}
        <div className="flex-1 min-w-[200px]">
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

        {/* PRICE */}
        <div className="w-40">
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

        {/* CATEGORY DROPDOWN */}
        <div className="w-52">
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
          </select>
        </div>

        {/* BUTTON */}
        <button className="btn btn-primary" onClick={addService}>
          Add
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="card bg-base-100 shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{s.title}</h3>
                  <p>${s.price}</p>
                  <p className="text-sm opacity-70">{s.category}</p>
                </div>

                <button
                  className="btn btn-error btn-sm"
                  onClick={() => deleteService(s.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
