import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

const ENDPOINTS = {
  REGISTER: "/api/auth/register/",
};

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // backend expects BUYER / SELLER
  const [role, setRole] = useState("BUYER");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const passwordHint = useMemo(() => {
    if (!password) return "Use at least 8 characters.";
    if (password.length < 8) return "Too short — minimum 8 characters.";
    return "Looks good ✅";
  }, [password]);

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
          role,
        }),
        auth: false,
      });

      setOk("Registered! Please check your inbox and click the verification link.");
      setPassword("");
    } catch (ex) {
      setErr(ex.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-base-200/70">
      <div className="relative max-w-6xl mx-auto px-4 py-10">
        {/* Soft background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Left panel */}
          <div className="hidden lg:flex">
            <div className="w-full rounded-3xl border border-base-200 bg-base-100 shadow-md shadow-black/10 p-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                  <span className="text-white font-extrabold">FH</span>
                </div>
                <div>
                  <div className="text-xl font-extrabold leading-tight">FreelancerHub</div>
                  <div className="text-sm text-base-content/60 -mt-0.5">
                    Hire & sell services
                  </div>
                </div>
              </div>

              <h1 className="mt-8 text-4xl font-extrabold leading-tight">
                Create your account and start shipping.
              </h1>
              <p className="mt-3 text-base-content/70 max-w-md">
                Get verified, stay secure, and manage orders with clear status tracking.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="flex items-start gap-3 rounded-2xl bg-base-200 p-4">
                  <div className="mt-0.5">
                    <ShieldCheck size={18} className="opacity-80" />
                  </div>
                  <div>
                    <div className="font-semibold">Email verification</div>
                    <div className="text-sm text-base-content/70">
                      Only verified users can log in — safer marketplace.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-base-200 p-4">
                  <div className="mt-0.5">
                    <Sparkles size={18} className="opacity-80" />
                  </div>
                  <div>
                    <div className="font-semibold">Role-based dashboards</div>
                    <div className="text-sm text-base-content/70">
                      Buyer & Seller have dedicated dashboards and tools.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-sm text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary font-medium">
                  Login here
                </Link>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="flex">
            <div className="w-full rounded-3xl border border-base-200 bg-base-100 shadow-md shadow-black/10">
              <div className="p-6 sm:p-10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-3xl font-extrabold">Create account</h2>
                    <p className="mt-1 text-base-content/70">
                      We’ll send a verification email. Only verified users can login.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-base-content/60">
                    <ShieldCheck size={16} />
                    Secure signup
                  </div>
                </div>

                {err ? (
                  <div className="alert alert-error mt-5">
                    <span>{err}</span>
                  </div>
                ) : null}

                {ok ? (
                  <div className="alert alert-success mt-5">
                    <span>{ok}</span>
                  </div>
                ) : null}

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                  {/* Username */}
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text font-medium">Username</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                        <User size={18} />
                      </span>
                      <input
                        className="input input-bordered h-12 w-full pl-10"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. myname"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </label>

                  {/* Email */}
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text font-medium">Email</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                        <Mail size={18} />
                      </span>
                      <input
                        className="input input-bordered h-12 w-full pl-10"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </label>

                  {/* Role + Password */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text font-medium">Role</span>
                      </div>
                      <select
                        className="select select-bordered h-12"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="BUYER">Buyer</option>
                        <option value="SELLER">Seller</option>
                      </select>
                    </label>

                    <label className="form-control">
                      <div className="label">
                        <span className="label-text font-medium">Password</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                          <Lock size={18} />
                        </span>
                        <input
                          className="input input-bordered h-12 w-full pl-10 pr-12"
                          type={showPass ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 8 characters"
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPass((v) => !v)}
                          aria-label="Toggle password visibility"
                        >
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className="mt-1 text-xs text-base-content/60">{passwordHint}</div>
                    </label>
                  </div>

                  <button
                    className="btn btn-primary w-full h-12 text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create account <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-between gap-3 text-sm">
                  <div className="text-base-content/70">
                    Already have an account?{" "}
                    <Link to="/login" className="link link-primary font-medium">
                      Login
                    </Link>
                  </div>
                  <Link to="/" className="link text-base-content/60 hover:text-base-content">
                    Back home
                  </Link>
                </div>

                <div className="mt-5 text-xs text-base-content/60">
                  After clicking the email link, you can login normally.
                </div>
              </div>

              {/* bottom bar */}
              <div className="border-t border-base-200 px-6 sm:px-10 py-4 text-xs text-base-content/60">
                Tip: Use a real email so you can verify and access dashboards.
              </div>
            </div>
          </div>
        </div>

        {/* Mobile hint */}
        <div className="lg:hidden mt-6 text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}