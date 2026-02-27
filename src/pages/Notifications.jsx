import { useEffect, useState } from "react";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";

export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const data = await api("/api/notifications/", { method: "GET" });
        const list = Array.isArray(data) ? data : (data?.results || []);
        setItems(list);
      } catch {
        setItems([]);
      }
    })();
  }, [user?.username]);

  if (!user) {
    return <div className="mx-auto max-w-6xl px-4 py-8 text-base-content/70">Please login.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-2xl font-bold">Notifications</div>
      <div className="text-sm text-base-content/70">Your latest updates.</div>

      <div className="mt-4 grid gap-3">
        {items.map((n) => (
          <div key={n.id} className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="font-semibold">{n.title || "Notification"}</div>
              <div className="text-sm text-base-content/70">{n.message || n.text || "—"}</div>
              <div className="text-xs text-base-content/60 mt-2">
                {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-base-content/70">No notifications yet.</div>
        )}
      </div>
    </div>
  );
}