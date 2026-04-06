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
  Moon,
  SunMedium,
} from "lucide-react";
import { useEffect, useState } from "react";

const navBase =
  "rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-all duration-200";

const NavItem = ({ to, icon: Icon, children }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${navBase} ${
          isActive
            ? "bg-primary text-primary-content shadow-md"
            : "text-base-content/75 hover:bg-base-200 hover:text-base-content"
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
    <div className="sticky top-0 z-50 border-b border-base-200/70 bg-base-100/85 backdrop-blur-xl">
      <div className="navbar mx-auto max-w-7xl px-4 py-2">
        <div className="navbar-start gap-2">
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-square rounded-2xl hover:bg-base-200">
              <Menu size={20} />
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-64 rounded-[24px] border border-base-200 bg-base-100 p-3 shadow-2xl"
            >
              <NavItem to="/services" icon={Briefcase}>Services</NavItem>
              {user && <NavItem to={dashboardPath} icon={LayoutDashboard}>Dashboard</NavItem>}
              {user && <NavItem to="/notifications" icon={Bell}>Notifications</NavItem>}
              {user && <NavItem to="/profile" icon={User}>Profile</NavItem>}
              {!user && <NavItem to="/login" icon={LogIn}>Login</NavItem>}
              {!user && <NavItem to="/register" icon={UserPlus}>Register</NavItem>}
            </ul>
          </div>

          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-md transition-transform duration-200 group-hover:scale-105">
              <span className="text-base font-black tracking-wide">FH</span>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-tight text-base-content">FreelancerHub</div>
              <div className="text-xs text-base-content/55">Professional service marketplace</div>
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 rounded-full border border-base-200 bg-base-100/70 p-1.5 shadow-sm">
            <NavItem to="/services" icon={Briefcase}>Services</NavItem>
            {user && <NavItem to={dashboardPath} icon={LayoutDashboard}>Dashboard</NavItem>}
            {user && <NavItem to="/notifications" icon={Bell}>Notifications</NavItem>}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-circle rounded-2xl hover:bg-base-200"
            title="Toggle theme"
            onClick={() => toggleTheme(!dark)}
          >
            {dark ? <SunMedium size={18} /> : <Moon size={18} />}
          </button>

          {!user ? (
            <>
              <Link className="btn btn-ghost hidden rounded-2xl sm:flex" to="/login">
                <LogIn size={16} className="mr-1" />
                Login
              </Link>
              <Link className="btn btn-primary rounded-2xl shadow-md" to="/register">
                <UserPlus size={16} className="mr-1" />
                Register
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost h-auto rounded-2xl px-2 py-1.5 hover:bg-base-200">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="w-10 rounded-2xl bg-primary text-primary-content shadow-sm">
                      <span className="text-sm font-bold">
                        {(user?.username || "U").slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="hidden min-w-0 sm:block text-left">
                    <div className="truncate text-sm font-semibold leading-tight text-base-content">
                      {user?.username}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-base-content/55">{user?.role}</div>
                  </div>
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 w-60 rounded-[24px] border border-base-200 bg-base-100 p-3 shadow-2xl"
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