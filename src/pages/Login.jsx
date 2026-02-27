import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";

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

      // role অনুযায়ী redirect
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
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-base-content/70">
            Use your username & password to get JWT token.
          </p>

          {err && <div className="alert alert-error mt-3">{err}</div>}

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <label className="form-control">
              <div className="label"><span className="label-text">Username</span></div>
              <input
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                required
              />
            </label>

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="text-sm text-base-content/70 mt-4">
            No account? <Link className="link" to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}