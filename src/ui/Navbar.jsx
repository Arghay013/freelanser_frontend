import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";

const NavItem = ({ to, children }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-lg ${isActive ? "bg-base-200 font-semibold" : ""}`
      }
    >
      {children}
    </NavLink>
  </li>
);

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-50 border-b border-base-200 bg-base-100/85 backdrop-blur">
      <div className="navbar max-w-6xl mx-auto px-4">
        {/* Left */}
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <NavItem to="/services">Services</NavItem>
              {!user && <NavItem to="/login">Login</NavItem>}
              {!user && <NavItem to="/register">Register</NavItem>}
              {user && <NavItem to="/profile">Profile</NavItem>}
              {user?.role === "BUYER" && <NavItem to="/buyer">Dashboard</NavItem>}
              {user?.role === "SELLER" && <NavItem to="/seller">Dashboard</NavItem>}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-xl w-9">
                <span className="font-bold">FH</span>
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-bold text-lg">FreelancerHub</div>
              <div className="text-xs text-base-content/60 -mt-1">Hire & sell services</div>
            </div>
          </Link>
        </div>

        {/* Center */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            <NavItem to="/services">Services</NavItem>
            {user?.role === "BUYER" && <NavItem to="/buyer">Buyer</NavItem>}
            {user?.role === "SELLER" && <NavItem to="/seller">Seller</NavItem>}
            {user && <NavItem to="/notifications">Notifications</NavItem>}
          </ul>
        </div>

        {/* Right */}
        <div className="navbar-end gap-2">
          {/* Theme toggle (optional) */}
          <label className="btn btn-ghost btn-circle">
            <input
              type="checkbox"
              className="toggle toggle-sm"
              onChange={(e) => {
                document.documentElement.setAttribute("data-theme", e.target.checked ? "dark" : "light");
              }}
              title="Toggle theme"
            />
          </label>

          {!user ? (
            <>
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Register
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost rounded-full">
                <div className="flex items-center gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-9">
                      <span className="text-sm font-semibold">
                        {(user?.username || "U").slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold leading-tight">{user?.username}</div>
                    <div className="text-xs text-base-content/60 -mt-1">{user?.role}</div>
                  </div>
                </div>
              </label>

              <ul tabIndex={0} className="menu dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
                <li>
                  <button type="button" onClick={() => navigate("/profile")}>Profile</button>
                </li>
                <li>
                  <button
  type="button"
  onClick={() => {
    logout();
    navigate("/login");
  }}
>
  Logout
</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}