import { useAuth } from "../state/auth";
import Card from "../ui/Card";
import { Mail, Shield, User } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Profile</h1>
          <p className="text-base-content/70">Your account info and role.</p>
        </div>
      </div>

      <Card>
        {!user ? (
          <div className="text-base-content/70">
            You are not logged in. Please login first.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-base-200 p-4">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <User size={16} /> Username
              </div>
              <div className="text-xl font-bold mt-1">{user.username}</div>
            </div>

            <div className="rounded-2xl bg-base-200 p-4">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Shield size={16} /> Role
              </div>
              <div className="mt-1">
                <span className="badge badge-primary badge-outline">{user.role}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-base-200 p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Mail size={16} /> Email
              </div>
              <div className="text-lg font-semibold mt-1">{user.email || "—"}</div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}