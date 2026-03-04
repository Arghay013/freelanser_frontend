import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";
import Card from "../ui/Card";
import { BellRing, Search, CheckCircle2 } from "lucide-react";

function cleanErrorMessage(err) {
  let m = err?.message || err?.data?.detail || "Failed to load notifications.";
  m = String(m);
  if (m.includes("<!doctype html") || m.includes("<html")) return "Server error (500).";
  if (m.length > 220) m = m.slice(0, 220) + "…";
  return m;
}

export default function Notifications() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setMsg("");
      const data = await api("/api/notifications/", { method: "GET" });
      const list = Array.isArray(data) ? data : data?.results || [];
      setItems(list);
    } catch (e) {
      setItems([]);
      setMsg(cleanErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;

    return items.filter((n) => {
      const t = String(n.ntype || "").toLowerCase();     // ✅ backend field
      const m = String(n.message || "").toLowerCase();   // ✅ backend field
      return t.includes(s) || m.includes(s);
    });
  }, [items, q]);

  const unreadCount = useMemo(() => items.filter((x) => !x.is_read).length, [items]);

  const markRead = async (id) => {
    try {
      await api(`/api/notifications/${id}/read/`, { method: "POST" });
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, is_read: true } : x)));
    } catch (e) {
      setMsg(cleanErrorMessage(e));
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-base-content/70">
        Please login.
      </div>
    );
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
          {unreadCount} unread / {items.length} total
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

      {msg ? (
        <div className="alert alert-error">
          <span>{msg}</span>
        </div>
      ) : null}

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
              <Card
                key={n.id}
                className={`hover:shadow-md transition ${
                  n.is_read ? "" : "border border-primary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {/* ✅ ntype দেখাও */}
                    <div className="font-semibold">
                      {n.ntype || "NOTIFICATION"}
                      {!n.is_read && <span className="badge badge-primary badge-sm ml-2">NEW</span>}
                    </div>

                    {/* ✅ message দেখাও */}
                    <div className="text-sm text-base-content/70 mt-1">
                      {n.message || "—"}
                    </div>

                    <div className="text-xs text-base-content/60 mt-3">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                    </div>
                  </div>

                  {/* ✅ mark read button */}
                  {!n.is_read ? (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => markRead(n.id)}
                      title="Mark as read"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  ) : null}
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