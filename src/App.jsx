import { Routes, Route } from "react-router-dom";
import Navbar from "./ui/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Verify from "./pages/Verify";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Footer from "./ui/Footer";

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card bg-base-100 shadow">
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

export default function App() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />

          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}