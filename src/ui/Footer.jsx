import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-base-200 bg-base-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_.8fr_.9fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-sm">
              <span className="font-black">FH</span>
            </div>
            <div>
              <div className="text-xl font-extrabold text-base-content">FreelancerHub</div>
              <div className="text-sm text-base-content/60">Hire better. Deliver smoothly.</div>
            </div>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-7 text-base-content/70">
            A clean freelancer marketplace for discovering services, managing requests, and keeping the full buyer-seller flow simple.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="badge badge-outline rounded-full">Secure accounts</span>
            <span className="badge badge-outline rounded-full">Clear order flow</span>
            <span className="badge badge-outline rounded-full">Fast request handling</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-base-content/55">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/" className="text-base-content/75 transition hover:text-base-content">Home</Link></li>
            <li><Link to="/services" className="text-base-content/75 transition hover:text-base-content">Services</Link></li>
            <li><Link to="/login" className="text-base-content/75 transition hover:text-base-content">Login</Link></li>
            <li><Link to="/register" className="text-base-content/75 transition hover:text-base-content">Create account</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-base-content/55">Platform</h3>
          <div className="mt-4 space-y-3 text-sm text-base-content/70">
            <p>Professional layout for buyers and sellers.</p>
            <p>Order requests, updates, review, and payment in one flow.</p>
            <p className="pt-3 text-xs text-base-content/55">
              © {new Date().getFullYear()} FreelancerHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}