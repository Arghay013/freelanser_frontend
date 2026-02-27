import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import Card from "../ui/Card";
import { Search, SlidersHorizontal, Star, Tag, ArrowLeft, ArrowRight } from "lucide-react";

const ENDPOINT = "/api/services/";

export default function Services() {
  const [sp, setSp] = useSearchParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("top");
  const [minP, setMinP] = useState(0);
  const [maxP, setMaxP] = useState(200);

  const [page, setPage] = useState(1);
  const pageSize = 9;

  // ✅ Read URL query on first mount / change
  useEffect(() => {
    const urlCat = sp.get("cat");
    const urlQ = sp.get("q");

    if (urlCat) setCat(urlCat);
    if (urlQ) setQ(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString()]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api(ENDPOINT);
        const list = Array.isArray(data) ? data : data?.results || [];

        const normalized = list.map((x, i) => ({
          id: x.id ?? i,
          title: x.title ?? "Service",
          category: x.category ?? "General",
          price: Number(x.price ?? 0),
          rating: Number(x.rating ?? 4.8),
          reviews: Number(x.reviews_count ?? 0),
          seller: String(x.seller_username ?? x.seller?.username ?? x.seller ?? "seller"),
          img: x.image || "/images/services.jpg",
          delivery: Number(x.delivery_time_days ?? x.delivery_days ?? 0),
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

  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category));
    return ["All", ...Array.from(set)];
  }, [services]);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  // ✅ Keep URL updated when filters change (nice UX + shareable link)
  useEffect(() => {
    const next = {};
    if (cat && cat !== "All") next.cat = cat;
    if (q && q.trim()) next.q = q.trim();
    setSp(next, { replace: true });
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, q]);

  // If sort/price changes reset page but no need to spam URL
  useEffect(() => {
    setPage(1);
  }, [sort, minP, maxP]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Browse Services</h1>
          <p className="text-base-content/70">Search, filter and choose the best freelancer.</p>
        </div>
        <div className="badge badge-outline">{filtered.length} results</div>
      </div>

      {/* FILTER BAR */}
      <Card className="shadow-sm" title="Filters" actions={<SlidersHorizontal size={18} className="opacity-70" />}>
        <div className="grid md:grid-cols-4 gap-3">
          <label className="form-control md:col-span-2">
            <div className="label">
              <span className="label-text flex items-center gap-2">
                <Search size={16} /> Search
              </span>
            </div>
            <input
              className="input input-bordered"
              placeholder="Search title, category, seller..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text flex items-center gap-2">
                <Tag size={16} /> Category
              </span>
            </div>
            <select className="select select-bordered" value={cat} onChange={(e) => setCat(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text flex items-center gap-2">
                <Star size={16} /> Sort
              </span>
            </div>
            <select className="select select-bordered" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="top">Top rated</option>
              <option value="price_low">Price: low → high</option>
              <option value="price_high">Price: high → low</option>
            </select>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="form-control">
            <div className="label"><span className="label-text">Min price</span></div>
            <input
              type="number"
              className="input input-bordered"
              value={minP}
              onChange={(e) => setMinP(Number(e.target.value || 0))}
              min={0}
            />
          </label>

          <label className="form-control">
            <div className="label"><span className="label-text">Max price</span></div>
            <input
              type="number"
              className="input input-bordered"
              value={maxP}
              onChange={(e) => setMaxP(Number(e.target.value || 0))}
              min={0}
            />
          </label>
        </div>
      </Card>

      {/* ERROR / LOADING */}
      {loading && (
        <Card>
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="loading loading-spinner loading-sm" />
            Loading services...
          </div>
        </Card>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      {/* GRID */}
      {!loading && !error && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageItems.map((s) => (
              <div key={s.id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-lg transition">
                <figure className="h-44">
                  <img src={s.img} alt={s.title} className="h-full w-full object-cover" />
                </figure>
                <div className="card-body gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-bold truncate">{s.title}</h2>
                      <div className="text-sm text-base-content/70">{s.category} • by {s.seller}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold">${s.price}</div>
                      <div className="text-xs text-base-content/60">
                        {s.delivery ? `${s.delivery} days` : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      ⭐ <span className="font-semibold">{s.rating.toFixed(1)}</span>{" "}
                      <span className="text-base-content/60">({s.reviews})</span>
                    </div>
                    <span className="badge badge-outline">{s.category}</span>
                  </div>

                  <div className="card-actions justify-end">
                    <Link to={`/services/${s.id}`} className="btn btn-primary btn-sm">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <Card>
              <div className="text-base-content/70">No services found for your filters.</div>
            </Card>
          )}

          {/* PAGINATION */}
          <div className="flex items-center justify-between gap-3">
            <button
              className="btn btn-outline"
              disabled={pageSafe === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ArrowLeft size={16} /> Prev
            </button>

            <div className="text-sm text-base-content/70">
              Page <span className="font-semibold text-base-content">{pageSafe}</span> of{" "}
              <span className="font-semibold text-base-content">{totalPages}</span>
            </div>

            <button
              className="btn btn-outline"
              disabled={pageSafe === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}