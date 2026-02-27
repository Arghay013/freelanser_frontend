import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./ui/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Verify from "./pages/Verify";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Footer from "./ui/Footer";
import { useAuth } from "./state/auth";

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body">
          <h1 className="text-2xl font-bold">404 — Page not found</h1>
          <p className="text-base-content/70 mt-2">
            This route doesn’t exist. Check the URL or use the menu.
          </p>
        </div>
      </div>
    </div>
  );
}

function RequireAuth({ children, role }) {
  const { user, booting } = useAuth();
  const loc = useLocation();

  if (booting) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <div className="flex items-center gap-2 text-base-content/70">
              <span className="loading loading-spinner loading-sm" />
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  if (role && user.role !== role) {
    if (user.role === "BUYER") return <Navigate to="/buyer" replace />;
    if (user.role === "SELLER") return <Navigate to="/seller" replace />;
    return <Navigate to="/services" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-base-200/30">
      <Navbar />

      <main className="min-h-[70vh]">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />

          {/* Protected */}
          <Route
            path="/buyer"
            element={
              <RequireAuth role="BUYER">
                <BuyerDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/seller"
            element={
              <RequireAuth role="SELLER">
                <SellerDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequireAuth>
                <Notifications />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}