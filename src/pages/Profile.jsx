import { useAuth } from "../state/auth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="text-2xl font-bold">Profile</h1>

          {!user ? (
            <p className="text-base-content/70 mt-2">
              You are not logged in. Please login first.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              <div><span className="font-semibold">Username:</span> {user.username}</div>
              <div><span className="font-semibold">Role:</span> {user.role}</div>
              <div><span className="font-semibold">Email:</span> {user.email || "—"}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}