import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-base-200 bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-content font-bold">FH</span>
            </div>
            <div className="text-xl font-bold text-base-content">FreelancerHub</div>
          </div>

          <p className="text-sm text-base-content/70 mt-3 leading-relaxed">
            A clean marketplace starter. Hire freelancers easily and grow your business with confidence.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge badge-primary badge-outline">DaisyUI</span>
            <span className="badge badge-secondary badge-outline">Tailwind</span>
            <span className="badge badge-accent badge-outline">JWT Auth</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-base-content">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="link link-hover text-base-content/75">Home</Link></li>
            <li><Link to="/services" className="link link-hover text-base-content/75">Services</Link></li>
            <li><Link to="/login" className="link link-hover text-base-content/75">Login</Link></li>
            <li><Link to="/register" className="link link-hover text-base-content/75">Register</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-base-content">Popular Categories</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li>Graphic Design</li>
            <li>Web Development</li>
            <li>Writing & Translation</li>
            <li>Video Editing</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-base-content">Contact</h3>
          <p className="text-sm text-base-content/70">
            Email: <span className="font-medium text-base-content">support@freelancerhub.com</span>
          </p>
          <p className="text-sm text-base-content/70 mt-1">
            Location: Bangladesh
          </p>
          <p className="text-xs text-base-content/60 mt-4">
            © {new Date().getFullYear()} FreelancerHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}