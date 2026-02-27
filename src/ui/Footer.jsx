import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="text-xl font-bold">FreelancerHub</div>
          <p className="text-sm text-base-content/70 mt-2">
            Hire freelancers easily and grow your business with confidence.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="link link-hover">Home</Link></li>
            <li><Link to="/services" className="link link-hover">Services</Link></li>
            <li><Link to="/login" className="link link-hover">Login</Link></li>
            <li><Link to="/register" className="link link-hover">Register</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li>Graphic Design</li>
            <li>Web Development</li>
            <li>Writing</li>
            <li>Video Editing</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-sm text-base-content/70">
            Email: support@freelancerhub.com
          </p>
          <p className="text-sm text-base-content/70 mt-1">
            Location: Bangladesh
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm text-base-content/60 border-t border-base-200 py-4">
        © {new Date().getFullYear()} FreelancerHub. All rights reserved.
      </div>
    </footer>
  );
}