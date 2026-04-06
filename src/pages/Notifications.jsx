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
  }, [user?.username]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;

    return items.filter((n) => {
      const t = String(n.ntype || "").toLowerCase();
      const m = String(n.message || "").toLowerCase();
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
    return <div className="mx-auto max-w-6xl px-4 py-12 text-base-content/70">Please login.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-6">
      <section className="rounded-[32px] border border-base-200 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <BellRing size={15} /> Notification center
            </div>
            <h1 className="mt-4 text-4xl font-black text-base-content">Notifications</h1>
            <p className="mt-2 text-base-content/70">View updates, search messages, and mark unread items as read.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-[22px] border border-base-200 bg-base-200/70 px-5 py-4">
              <div className="text-xs uppercase tracking-wide text-base-content/55">Unread</div>
              <div className="mt-1 text-3xl font-black text-base-content">{unreadCount}</div>
            </div>
            <div className="rounded-[22px] border border-base-200 bg-base-200/70 px-5 py-4">
              <div className="text-xs uppercase tracking-wide text-base-content/55">Total</div>
              <div className="mt-1 text-3xl font-black text-base-content">{items.length}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex h-14 items-center gap-3 rounded-[22px] border border-base-200 bg-base-100 px-4 shadow-sm">
          <Search size={18} className="opacity-60" />
          <input
            className="h-full w-full bg-transparent outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search notifications..."
          />
        </div>
      </section>

      {msg ? <div className="alert alert-error"><span>{msg}</span></div> : null}

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <div className="flex items-center gap-2 text-base-content/70">
              <span className="loading loading-spinner loading-sm" />
              Loading notifications...
            </div>
          </Card>
        ) : filtered.length > 0 ? (
          filtered.map((n) => (
            <Card key={n.id} className={`${n.is_read ? "" : "border-primary/30 shadow-md"}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-base font-bold text-base-content">{n.ntype || "NOTIFICATION"}</div>
                    {!n.is_read ? <span className="badge badge-primary rounded-full border-none">New</span> : null}
                  </div>

                  <div className="mt-2 text-sm leading-7 text-base-content/72 break-words">{n.message || "—"}</div>

                  <div className="mt-4 text-xs text-base-content/55">
                    {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                  </div>
                </div>

                {!n.is_read ? (
                  <button
                    className="btn btn-outline btn-sm rounded-2xl"
                    onClick={() => markRead(n.id)}
                    title="Mark as read"
                  >
                    <CheckCircle2 size={16} /> Mark read
                  </button>
                ) : null}
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="py-3 text-center text-base-content/70">No notifications found.</div>
          </Card>
        )}
      </div>
    </div>
  );
}