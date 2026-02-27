import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";
import Card from "../ui/Card";
import { BellRing, Search } from "lucide-react";

export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setLoading(true);
        const data = await api("/api/notifications/", { method: "GET" });
        const list = Array.isArray(data) ? data : (data?.results || []);
        setItems(list);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.username]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((n) => {
      const t = String(n.title || "").toLowerCase();
      const m = String(n.message || n.text || "").toLowerCase();
      return t.includes(s) || m.includes(s);
    });
  }, [items, q]);

  if (!user) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-base-content/70">Please login.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Notifications</h1>
          <p className="text-base-content/70">Your latest updates and system messages.</p>
        </div>
        <div className="badge badge-outline">
          <BellRing size={14} className="mr-1" />
          {items.length} total
        </div>
      </div>

      <div className="join w-full">
        <div className="join-item btn btn-ghost pointer-events-none">
          <Search size={16} />
        </div>
        <input
          className="join-item input input-bordered w-full"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search notifications..."
        />
      </div>

      <div className="grid gap-3">
        {loading ? (
          <Card>
            <div className="flex items-center gap-2 text-base-content/70">
              <span className="loading loading-spinner loading-sm" />
              Loading notifications...
            </div>
          </Card>
        ) : (
          <>
            {filtered.map((n) => (
              <Card key={n.id} className="hover:shadow-md transition">
                <div className="font-semibold">{n.title || "Notification"}</div>
                <div className="text-sm text-base-content/70 mt-1">{n.message || n.text || "—"}</div>
                <div className="text-xs text-base-content/60 mt-3">
                  {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                </div>
              </Card>
            ))}

            {filtered.length === 0 && (
              <Card>
                <div className="text-base-content/70">No notifications found.</div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}