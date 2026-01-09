import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, Calendar, DollarSign,
  Award, AlertTriangle, BarChart3, Settings, Bell, Search, UserCircle2, ArrowRight
} from "lucide-react";

import Provider from "./Provider";
import Disputes from "./Disputes";
import Reports from "./Reports"; // ✅ Imported Reports

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Protect admin dashboard - redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated() || !user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, isAuthenticated, navigate]);

  const sections = useMemo(() => [
    { name: "Overview", icon: LayoutDashboard, key: "overview" },
    { name: "Users", icon: Users, key: "users" },
    { name: "Providers", icon: UserCheck, key: "providers" },
    { name: "Sessions", icon: Calendar, key: "sessions" },
    { name: "Escrow & Payments", icon: DollarSign, key: "escrow" },
    { name: "Certificates", icon: Award, key: "certificates" },
    { name: "Disputes", icon: AlertTriangle, key: "disputes" },
    { name: "Reports", icon: BarChart3, key: "reports" },
    { name: "Contact Admin", icon: Users, key: "contact" },
    { name: "Settings", icon: Settings, key: "settings" },
  ], []);

  const [stats, setStats] = useState({
    totalUsers: 2456,
    totalProviders: 512,
    activeSessions: 27,
    escrowValue: 83.5,
    certificatesMinted: 423,
    systemAlerts: ["Provider KYC pending for John Doe", "Dispute #101 filed"],
  });

  const [users, setUsers] = useState([
    { id: 1, name: "Alice Johnson", role: "Learner", status: "Active" },
    { id: 2, name: "Bob Williams", role: "Provider", status: "Verified" },
    { id: 3, name: "Charlie Brown", role: "Learner", status: "Suspended" },
    { id: 4, name: "Diana Prince", role: "Provider", status: "Pending KYC" },
  ]);

  const [disputes, setDisputes] = useState([
    { id: 101, session: "Math Session", user: "Alice Johnson", provider: "Bob Williams", status: "Pending" },
    { id: 102, session: "Art Class", user: "Eve Adams", provider: "Frank White", status: "Resolved" },
  ]);

  // Handle section changes and hash-based navigation
  useEffect(() => {
    const scrollToContact = () => {
      const element = document.getElementById('contact-section');
      if (element) {
        // First, make sure the section is visible by setting active section
        setActiveSection('contact');
        
        // Then scroll to it after a small delay to ensure it's rendered
        const scroll = () => {
          const headerOffset = 80; // Adjust this value based on your header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        };
        
        // Try to scroll immediately and after a short delay
        scroll();
        const timer = setTimeout(scroll, 100);
        return () => clearTimeout(timer);
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#contact') {
        scrollToContact();
      }
    };

    // Check hash on initial load
    if (window.location.hash === '#contact') {
      // Set active section and scroll
      setActiveSection('contact');
      const timer = setTimeout(scrollToContact, 100);
      return () => clearTimeout(timer);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial check in case we land directly on the page with a hash
    handleHashChange();
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); // Removed activeSection from dependencies to prevent loops

  const renderSection = () => {
    const sectionComponents = {
      overview: () => <OverviewSection stats={stats} />,
      users: () => <UserManagement users={users} />,
      providers: () => <Provider />,
      sessions: () => <SessionManagement />,
      escrow: () => <EscrowPanel />,
      certificates: () => <CertificateManager />,
      disputes: () => <Disputes disputes={disputes} />,
      reports: () => <Reports />,
      contact: () => <ContactAdminSection />,
      settings: () => <SettingsPanel />,
    };

    const Component = sectionComponents[activeSection];
    return Component ? (
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Component />
      </motion.div>
    ) : null;
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-6 space-y-4 shadow-xl">
        <h2 className="text-3xl font-extrabold mb-8 text-white flex items-center gap-2">
          Admin Panel <Settings size={28} />
        </h2> 
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-4 w-full text-left p-3 rounded-xl transit ion-all duration-200 ${
              activeSection === s.key
                ? "bg-indigo-500 font-semibold shadow-inner"
                : "hover:bg-indigo-600 text-indigo-100"
            }`}
          >
            <s.icon className="w-5 h-5" />
            <span>{s.name}</span>
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 capitalize">{activeSection}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button className="relative p-2 rounded-full bg-white hover:bg-gray-200 transition">
              <Bell size={24} />
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-gray-700 font-medium">Admin User</span>
              <UserCircle2 size={32} />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>
      </main>
    </div>
  );
};

/* ---------------- Subcomponents (unchanged except removed AnalyticsDashboard) ---------------- */

const OverviewSection = ({ stats }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { label: "Total Users", value: stats.totalUsers, icon: Users },
        { label: "Providers", value: stats.totalProviders, icon: UserCheck },
        { label: "Active Sessions", value: stats.activeSessions, icon: Calendar },
        { label: "Escrow Locked (ETH)", value: stats.escrowValue, icon: DollarSign },
        { label: "Certificates Minted", value: stats.certificatesMinted, icon: Award },
      ].map((card, i) => (
        <motion.div
          key={i}
          className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-start hover:shadow-xl transition-all cursor-pointer"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <card.icon size={24} />
          </div>
          <h3 className="text-gray-600 font-medium text-lg">{card.label}</h3>
          <p className="text-4xl font-bold text-indigo-700 mt-1">{card.value}</p>
        </motion.div>
      ))}
    </div>

    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="text-yellow-500" /> System Alerts
      </h2>
      <ul className="space-y-3">
        {stats.systemAlerts.length > 0 ? (
          stats.systemAlerts.map((alert, i) => (
            <li key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-yellow-400">
              <span className="text-gray-700">{alert}</span>
              <ArrowRight size={20} className="text-gray-500" />
            </li>
          ))
        ) : (
          <p className="text-gray-500">No new alerts.</p>
        )}
      </ul>
    </div>
  </motion.div>
);

const UserManagement = ({ users }) => (
  <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">User Management</h2>
    <div className="mb-4">
      <input type="text" placeholder="Search users..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.role}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === "Active" || user.status === "Verified"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                <button className="text-red-600 hover:text-red-900">Suspend</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SessionManagement = () => (
  <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Session Management</h2>
    <p className="text-gray-600">Monitor live and upcoming sessions.</p>
  </div>
);

const EscrowPanel = () => (
  <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Escrow & Payments</h2>
    <p className="text-gray-600">Manage blockchain escrow transactions.</p>
  </div>
);

const CertificateManager = () => (
  <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">NFT Certificates</h2>
    <p className="text-gray-600">View and verify all issued certificates stored on IPFS.</p>
  </div>
);

const ContactAdminSection = () => {
  const adminContact = {
    name: "Admin Support",
    email: "admin@blockmarket.com",
    phone: "+1 (555) 123-4567",
    availability: "Monday - Friday, 9:00 AM - 6:00 PM",
    address: "123 Blockchain Street, Crypto City, 100001"
  };

  return (
    <motion.div 
      id="contact-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
      
      <div className="space-y-6">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">Administrative Support</h3>
          <div className="space-y-3">
            <p className="flex items-center text-gray-700">
              <span className="font-medium w-24">Name:</span>
              <span>{adminContact.name}</span>
            </p>
            <p className="flex items-center text-gray-700">
              <span className="font-medium w-24">Email:</span>
              <a href={`mailto:${adminContact.email}`} className="text-indigo-600 hover:underline">
                {adminContact.email}
              </a>
            </p>
            <p className="flex items-center text-gray-700">
              <span className="font-medium w-24">Phone:</span>
              <a href={`tel:${adminContact.phone.replace(/[^0-9+]/g, '')}`} className="text-indigo-600 hover:underline">
                {adminContact.phone}
              </a>
            </p>
            <p className="flex items-start text-gray-700">
              <span className="font-medium w-24 mt-1">Availability:</span>
              <span>{adminContact.availability}</span>
            </p>
            <p className="flex items-start text-gray-700">
              <span className="font-medium w-24 mt-1">Address:</span>
              <span>{adminContact.address}</span>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions or need assistance, please don't hesitate to contact our admin team.
            We're here to help you with any issues or inquiries you might have.
          </p>
          <button 
            onClick={() => window.location.href = `mailto:${adminContact.email}`}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Send Email
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsPanel = () => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    <p className="text-gray-600">System settings and configurations will be available here.</p>
  </div>
);

export default AdminDashboard;
