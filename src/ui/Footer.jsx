import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-xl font-bold">FreelancerHub</div>
          <p className="text-sm text-base-content/70 mt-2 leading-relaxed">
            A clean marketplace starter. Hire freelancers easily and grow your business with confidence.
          </p>

          <div className="mt-4 flex gap-2">
            <span className="badge badge-outline">DaisyUI</span>
            <span className="badge badge-outline">Tailwind</span>
            <span className="badge badge-outline">JWT Auth</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="link link-hover">Home</Link></li>
            <li><Link to="/services" className="link link-hover">Services</Link></li>
            <li><Link to="/login" className="link link-hover">Login</Link></li>
            <li><Link to="/register" className="link link-hover">Register</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Popular Categories</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li>Graphic Design</li>
            <li>Web Development</li>
            <li>Writing & Translation</li>
            <li>Video Editing</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-sm text-base-content/70">
            Email: <span className="font-medium">support@freelancerhub.com</span>
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