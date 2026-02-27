import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

const ENDPOINTS = {
  VERIFY: "/api/auth/verify/", 
};

export default function Verify() {
  const [sp] = useSearchParams();
  const token = sp.get("token") || "";

  const [status, setStatus] = useState("loading"); // loading | ok | err
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!token) {
        setStatus("err");
        setMsg("Missing token in URL.");
        return;
      }
      try {
        const data = await api(`${ENDPOINTS.VERIFY}?token=${encodeURIComponent(token)}`, {
          method: "GET",
        });
        setStatus("ok");
        setMsg(data?.detail || "Email verified. You can login now.");
      } catch (e) {
        setStatus("err");
        setMsg(e.message || "Invalid or expired token.");
      }
    })();
  }, [token]);

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="card bg-base-100 shadow">
        <div className="card-body gap-4">
          <h1 className="text-2xl font-bold">Email verification</h1>

          {status === "loading" && (
            <div className="alert">
              <span>Verifying…</span>
            </div>
          )}

          {status === "ok" && (
            <div className="alert alert-success">
              <span>{msg}</span>
            </div>
          )}

          {status === "err" && (
            <div className="alert alert-error">
              <span>{msg}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
            <Link to="/" className="btn btn-ghost">
              Home
            </Link>
          </div>

          <div className="text-xs text-base-content/60">
            If verification fails, register again and use the latest email link.
          </div>
        </div>
      </div>
    </div>
  );
}