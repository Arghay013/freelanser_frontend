import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

// ✅ YOUR LIVE BACKEND
const ENDPOINT = "/api/services/";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("top");
  const [minP, setMinP] = useState(0);
  const [maxP, setMaxP] = useState(200);

  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    (async () => {
      try {
        const data = await api(ENDPOINT);

        const list = Array.isArray(data) ? data : data?.results || [];

        const normalized = list.map((x, i) => ({
          id: x.id ?? i,
          title: x.title ?? "Service",
          category: x.category ?? "General",
          price: Number(x.price ?? 0),
          rating: Number(x.rating ?? 4.8),
          reviews: Number(x.reviews_count ?? 0),
          seller: String(x.seller_username ?? x.seller ?? "seller"),
          img: x.image || "/images/services.jpg",
        }));

        setServices(normalized);
      } catch (e) {
        console.error(e);
        setError("API load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();

    let list = services.filter((s) => {
      const title = String(s.title).toLowerCase();
      const category = String(s.category).toLowerCase();
      const seller = String(s.seller).toLowerCase();

      return (
        (!query || title.includes(query) || category.includes(query) || seller.includes(query)) &&
        (cat === "All" || s.category === cat) &&
        s.price >= minP &&
        s.price <= maxP
      );
    });

    if (sort === "price_low") list.sort((a, b) => a.price - b.price);
    if (sort === "price_high") list.sort((a, b) => b.price - a.price);
    if (sort === "top") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [services, q, cat, minP, maxP, sort]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ================= UI =================
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Browse Services</h1>

      {/* SEARCH */}
      <input
        className="input input-bordered w-full"
        placeholder="Search..."
        value={q}
        onChange={(e) => {
          setPage(1);
          setQ(e.target.value);
        }}
      />

      {/* ERROR / LOADING */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-4">
        {pageItems.map((s) => (
          <div key={s.id} className="card shadow">
            <img src={s.img} className="h-40 object-cover" />
            <div className="p-4">
              <h2 className="font-bold">{s.title}</h2>
              <p>{s.category}</p>
              <p>${s.price}</p>
              <p>⭐ {s.rating}</p>

              <Link to="/login" className="btn btn-primary btn-sm mt-2">
                Order
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>{page} / {totalPages || 1}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}