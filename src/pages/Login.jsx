import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";
import { Lock, LogIn, User } from "lucide-react";

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
    <div className="min-h-[calc(100vh-160px)] px-4 py-12">
      <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="hidden rounded-[32px] border border-base-200 bg-base-100 p-10 shadow-xl lg:block">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary text-primary-content shadow-md">
            <LogIn size={24} />
          </div>
          <h1 className="mt-8 text-4xl font-black leading-tight text-base-content">Welcome back to FreelancerHub</h1>
          <p className="mt-4 max-w-lg text-base leading-8 text-base-content/70">
            Sign in to continue managing your services, requests, notifications, and role-based dashboard in a cleaner interface.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[24px] border border-base-200 bg-base-200/70 p-5">
              <div className="font-bold text-base-content">Buyer flow</div>
              <div className="mt-2 text-sm leading-7 text-base-content/70">Request a service, review seller updates, then pay at the correct stage.</div>
            </div>
            <div className="rounded-[24px] border border-base-200 bg-base-200/70 p-5">
              <div className="font-bold text-base-content">Seller flow</div>
              <div className="mt-2 text-sm leading-7 text-base-content/70">Accept or reject buyer requests first, then send updates from your dashboard.</div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-base-200 bg-base-100 shadow-xl">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LogIn size={20} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-base-content">Login</h2>
                <p className="text-sm text-base-content/65">Use your username and password to continue.</p>
              </div>
            </div>

            {err ? <div className="alert alert-error mt-6"><span>{err}</span></div> : null}

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="form-control">
                <div className="label"><span className="label-text font-medium">Username</span></div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-55"><User size={18} /></span>
                  <input
                    className="input input-bordered h-12 w-full rounded-2xl bg-base-100 pl-11"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="e.g. argho"
                    required
                  />
                </div>
              </label>

              <label className="form-control">
                <div className="label"><span className="label-text font-medium">Password</span></div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-55"><Lock size={18} /></span>
                  <input
                    type="password"
                    className="input input-bordered h-12 w-full rounded-2xl bg-base-100 pl-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </label>

              <button className="btn btn-primary h-12 w-full rounded-2xl shadow-sm" disabled={loading}>
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

            <div className="mt-6 text-sm text-base-content/70">
              No account? <Link className="link link-primary font-medium" to="/register">Register</Link>
            </div>

            <div className="mt-3 text-xs text-base-content/58">Tip: Ensure your email is verified before login.</div>
          </div>
        </div>
      </div>
    </div>
  );
}