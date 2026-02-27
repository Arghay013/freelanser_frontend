import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";
import { LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const me = await login({ username, password });

      if (me?.role === "BUYER") navigate("/buyer");
      else if (me?.role === "SELLER") navigate("/seller");
      else navigate("/services");
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body gap-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LogIn className="text-primary" size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-base-content/70">
                Login with your username & password.
              </p>
            </div>
          </div>

          {err && <div className="alert alert-error">{err}</div>}

          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="form-control">
              <div className="label"><span className="label-text">Username</span></div>
              <input
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="e.g. argho"
                required
              />
            </label>

            <label className="form-control">
              <div className="label"><span className="label-text">Password</span></div>
              <input
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </label>

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-sm text-base-content/70">
            No account? <Link className="link link-primary" to="/register">Register</Link>
          </div>

          <div className="text-xs text-base-content/60">
            Tip: Ensure email is verified before login.
          </div>
        </div>
      </div>
    </div>
  );
}