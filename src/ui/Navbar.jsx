import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";
import {
  Briefcase,
  Bell,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";

const NavItem = ({ to, icon: Icon, children }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 flex items-center gap-2 transition-all duration-200 ${
          isActive
            ? "bg-primary text-primary-content font-semibold shadow-sm"
            : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
        }`
      }
    >
      {Icon ? <Icon size={16} className="opacity-90" /> : null}
      <span>{children}</span>
    </NavLink>
  </li>
);

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);

  const dashboardPath =
    user?.role === "BUYER" ? "/buyer" : user?.role === "SELLER" ? "/seller" : "/profile";

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
    <div className="sticky top-0 z-50 border-b border-base-200/80 bg-base-100/90 backdrop-blur-md shadow-sm">
      <div className="navbar max-w-6xl mx-auto px-4">
        <div className="navbar-start gap-2">
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-square hover:bg-base-200">
              <Menu size={20} />
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-60 rounded-2xl bg-base-100 p-2 shadow-xl border border-base-200"
            >
              <NavItem to="/services" icon={Briefcase}>Services</NavItem>
              {user && <NavItem to={dashboardPath} icon={LayoutDashboard}>Dashboard</NavItem>}
              {user && <NavItem to="/notifications" icon={Bell}>Notifications</NavItem>}
              {user && <NavItem to="/profile" icon={User}>Profile</NavItem>}
              {!user && <NavItem to="/login" icon={LogIn}>Login</NavItem>}
              {!user && <NavItem to="/register" icon={UserPlus}>Register</NavItem>}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
              <span className="text-primary-content font-bold text-lg tracking-wide">FH</span>
            </div>

            <div className="leading-tight">
              <div className="font-bold text-lg tracking-tight text-base-content">FreelancerHub</div>
              <div className="text-xs text-base-content/60 -mt-1">Hire & sell services</div>
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            <NavItem to="/services" icon={Briefcase}>Services</NavItem>
            {user && <NavItem to={dashboardPath} icon={LayoutDashboard}>Dashboard</NavItem>}
            {user && <NavItem to="/notifications" icon={Bell}>Notifications</NavItem>}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <label className="btn btn-ghost btn-circle hover:bg-base-200" title="Toggle theme">
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={dark}
              onChange={(e) => toggleTheme(e.target.checked)}
            />
          </label>

          {!user ? (
            <>
              <Link className="btn btn-ghost hidden sm:flex hover:bg-base-200" to="/login">
                <LogIn size={16} className="mr-1" />
                Login
              </Link>
              <Link className="btn btn-primary shadow-sm" to="/register">
                <UserPlus size={16} className="mr-1" />
                Register
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost rounded-full hover:bg-base-200">
                <div className="flex items-center gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-9 shadow-sm">
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

              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 w-56 rounded-2xl bg-base-100 p-2 shadow-xl border border-base-200"
              >
                <li>
                  <button onClick={() => navigate(dashboardPath)}>
                    <LayoutDashboard size={16} className="opacity-80" /> Dashboard
                  </button>
                </li>

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