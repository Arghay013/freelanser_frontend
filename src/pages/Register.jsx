import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

const ENDPOINTS = {
  REGISTER: "/api/auth/register/",
};

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // ✅ backend expects BUYER / SELLER
  const [role, setRole] = useState("BUYER");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);

    try {
      await api(ENDPOINTS.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
          role, // ✅ already uppercase
        }),
        auth: false, // ✅ register endpoint doesn't need token
      });

      setOk("Registered! Please check your inbox and click the verification link.");
    } catch (ex) {
      setErr(ex.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="card bg-base-100 shadow">
        <div className="card-body gap-4">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-base-content/70">
            We’ll send a verification email. Only verified users can login.
          </p>

          {err ? (
            <div className="alert alert-error">
              <span>{err}</span>
            </div>
          ) : null}

          {ok ? (
            <div className="alert alert-success">
              <span>{ok}</span>
            </div>
          ) : null}

          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. myname"
                autoComplete="username"
                required
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                className="input input-bordered"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Role</span>
              </div>
              <select
                className="select select-bordered"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="BUYER">Buyer</option>
                <option value="SELLER">Seller</option>
              </select>
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                className="input input-bordered"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                autoComplete="new-password"
                required
              />
            </label>

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <div className="text-sm text-base-content/70">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </div>

          <div className="text-xs text-base-content/60">
            After clicking the email link, you can login normally.
          </div>
        </div>
      </div>
    </div>
  );
}