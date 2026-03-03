import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function SellerDashboard() {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const loadServices = async () => {
    const res = await api.get("/services/mine/");
    setServices(res.data);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const createService = async () => {
    await api.post("/services/", {
      title,
      price,
      description: "New service",
    });
    setTitle("");
    setPrice("");
    loadServices();
  };

  const deleteService = async (id) => {
    await api.delete(`/services/${id}/edit/`);
    loadServices();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>

      {/* CREATE */}
      <div className="mt-4 flex gap-2">
        <input
          className="input input-bordered"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createService}>
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="mt-6">
        {services.map((s) => (
          <div key={s.id} className="card bg-base-100 shadow p-4 mb-3">
            <h2 className="font-bold">{s.title}</h2>
            <p>${s.price}</p>

            <button
              className="btn btn-error mt-2"
              onClick={() => deleteService(s.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}