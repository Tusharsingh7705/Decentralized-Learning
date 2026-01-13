import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Landing from "../src/pages/Landing.jsx";
import Register from "../src/pages/Register.jsx";
import Wallet from "../src/pages/Wallet.jsx";
 


// Learner
import LearnerProfile from "../src/pages/learner/LearnerProfile.jsx";
import LearnerSignup from "../src/pages/learner/LearnerSignup.jsx";
import LearnerLogin from "../src/pages/learner/LearnerLogin.jsx";
import Dashboard from "../src/pages/learner/Dashboard.jsx";
import SearchProviders from "../src/pages/learner/SearchProviders.jsx";
import LearnerSessionRoom from "../src/pages/learner/LearnerSessionRoom.jsx";
import Certificates from "../src/pages/learner/Certificates.jsx";

// Provider
import AnalyticsSection from "../src/pages/provider/AnalyticsSection.jsx";
import ProviderProfile from "../src/pages/provider/ProviderProfile.jsx";
import Earnings from "../src/pages/provider/Earnings.jsx";
import ProviderSignup from "../src/pages/provider/ProviderSignup.jsx";
import ProviderLogin from "../src/pages/provider/ProviderLogin.jsx";
import ProviderDashboard from "./pages/provider/ProviderDashboard.jsx";
import SessionsRoom from "./pages/provider/SessionsRoom.jsx";
import Ratings from "../src/pages/provider/Ratings.jsx";

// Admin
import AdminSignup from "../src/pages/admin/AdminSignup.jsx";
import AdminLogin from "../src/pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Provider from "../src/pages/admin/Provider.jsx";
import Disputes from "../src/pages/admin/Disputes.jsx";
import Reports from "../src/pages/admin/Reports.jsx";


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
        {/* Public routes  */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />

        {/* User */}        
        <Route path="/wallet" element={<Wallet />} />

        {/* Learner */}
        <Route path="/learner/signup" element={<LearnerSignup />} />
        <Route path="/learner/dashboard" element={<Dashboard />} />
        <Route path="/learner/login" element={<LearnerLogin />} />
        <Route path="/learner/profile" element={<LearnerProfile />} />
        <Route path="/learner/search" element={<SearchProviders />} />
        <Route path="/learner/session" element={<LearnerSessionRoom />} />
        <Route path="/learner/certificates" element={<Certificates />} />

        {/* Provider */}
        <Route path="/provider/AnalyticsSection" element={<AnalyticsSection />} />
        <Route path="/provider/Earnings" element={<Earnings />} />
        <Route path="/provider/signup" element={<ProviderSignup />} />
        <Route path="/provider/login" element={<ProviderLogin />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/profile" element={<ProviderProfile />} />
        <Route path="/provider/session" element={<SessionsRoom />} />
        <Route path="/provider/ratings" element={<Ratings />} />

        {/* Admin */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/provider" element={<Provider />} />
        <Route path="/admin/disputes" element={<Disputes />} />
        <Route path="/admin/reports" element={<Reports />} />

        
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  )
}

export default App
