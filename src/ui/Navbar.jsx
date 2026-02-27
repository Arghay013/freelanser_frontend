import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";
import { Briefcase, Bell, LogIn, UserPlus, User, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";

const NavItem = ({ to, icon: Icon, children }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 flex items-center gap-2 transition ${
          isActive ? "bg-base-200 font-semibold" : "hover:bg-base-200/70"
        }`
      }
    >
      {Icon ? <Icon size={16} className="opacity-80" /> : null}
      <span>{children}</span>
    </NavLink>
  </li>
);

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = (checked) => {
    const theme = checked ? "dark" : "light";
    setDark(checked);
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <div className="sticky top-0 z-50 border-b border-base-200 bg-base-100/85 backdrop-blur">
      <div className="navbar max-w-6xl mx-auto px-4">
        {/* Left */}
        <div className="navbar-start gap-2">
          {/* Mobile menu */}
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-square">
              <Menu size={20} />
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-60 rounded-box bg-base-100 p-2 shadow border border-base-200"
            >
              <NavItem to="/services" icon={Briefcase}>Services</NavItem>

              {!user && <NavItem to="/login" icon={LogIn}>Login</NavItem>}
              {!user && <NavItem to="/register" icon={UserPlus}>Register</NavItem>}

              {user && <NavItem to="/profile" icon={User}>Profile</NavItem>}
              {user?.role === "BUYER" && <NavItem to="/buyer" icon={User}>Dashboard</NavItem>}
              {user?.role === "SELLER" && <NavItem to="/seller" icon={User}>Dashboard</NavItem>}
              {user && <NavItem to="/notifications" icon={Bell}>Notifications</NavItem>}
            </ul>
          </div>

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg tracking-wide">FH</span>
            </div>

            <div className="leading-tight">
              <div className="font-bold text-lg tracking-tight">FreelancerHub</div>
              <div className="text-xs text-base-content/60 -mt-1">Hire & sell services</div>
            </div>
          </Link>
        </div>

        {/* Center (desktop menu) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            <NavItem to="/services" icon={Briefcase}>Services</NavItem>
            {user && <NavItem to="/notifications" icon={Bell}>Notifications</NavItem>}
          </ul>
        </div>

        {/* Right */}
        <div className="navbar-end gap-2">
          {/* Theme toggle */}
          <label className="btn btn-ghost btn-circle" title="Toggle theme">
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={dark}
              onChange={(e) => toggleTheme(e.target.checked)}
            />
          </label>

          {!user ? (
            <>
              <Link className="btn btn-ghost hidden sm:flex" to="/login">
                <LogIn size={16} className="mr-1" />
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                <UserPlus size={16} className="mr-1" />
                Register
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost rounded-full">
                <div className="flex items-center gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full w-9 shadow-md">
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

              <ul tabIndex={0} className="menu dropdown-content mt-3 w-56 rounded-box bg-base-100 p-2 shadow border border-base-200">
                <li>
                  <button onClick={() => navigate("/profile")}>
                    <User size={16} className="opacity-80" /> Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    <LogOut size={16} className="opacity-80" /> Logout
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