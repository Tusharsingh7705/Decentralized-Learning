import React, { useState, useCallback } from "react";
import ProviderProfile from "./ProviderProfile"; // import profile component
import AnalyticsSection from "./AnalyticsSection"; // import analytics component
import SessionsRoom from "./SessionsRoom"; // import sessions component
import Earnings from "./Earnings"; // import earnings component
import Ratings from "./Ratings"; // import ratings component

// A simple utility to format currency
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

// --- Navigation Data ---
const navItems = [
  { id: "dashboard", name: "Dashboard", icon: "🏠" },
  { id: "profile", name: "Profile", icon: "👤" },
  { id: "sessions", name: "Sessions", icon: "🗓️" },
  { id: "earnings", name: "Earnings", icon: "💰" },
  { id: "ratings", name: "Ratings", icon: "⭐" },
  { id: "analytics", name: "Analytics", icon: "📊" },
  { id: "support", name: "Support", icon: "❓" },
];

// --- Mock Data ---
const mockData = {
  stats: {
    upcomingSessions: 3,
    totalEarnings: 450.75,
    pendingEscrow: 125.0,
    averageRating: 4.8,
  },
  notifications: [
    { id: 1, message: "New booking from Alex R." },
    { id: 2, message: "Earnings released: $55.00" },
    { id: 3, message: "Rating updated: 5 stars!" },
  ],
  earningsTrend: [
    { month: "Jan", earnings: 400 },
    { month: "Feb", earnings: 300 },
    { month: "Mar", earnings: 600 },
    { month: "Apr", earnings: 750 },
  ],
  sessions: [
    { id: 1, learner: "Alex R.", time: "10:00 AM", status: "upcoming" },
    { id: 2, learner: "Jane D.", time: "2:30 PM", status: "completed" },
    { id: 3, learner: "Chris L.", time: "4:00 PM", status: "upcoming" },
  ],
  reviews: [
    {
      id: 1,
      learner: "Learner Z",
      rating: 5,
      comment: "Excellent explanation, highly recommend!",
      date: "09/25/2025",
    },
    {
      id: 2,
      learner: "Learner Y",
      rating: 4,
      comment: "Very helpful and patient.",
      date: "09/20/2025",
    },
    {
      id: 3,
      learner: "Learner X",
      rating: 5,
      comment: "Great session on smart contracts.",
      date: "09/18/2025",
    },
  ],
};

// ===============================================
// === Main Dashboard Component ===
// ===============================================

const TutorDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Component for Sidebar Navigation Item ---
  const NavItem = ({ item }) => (
    <button
      onClick={() => {
        setActiveSection(item.id);
        setIsSidebarOpen(false); // Close sidebar on mobile after selection
      }}
      className={`
        flex items-center w-full p-3 text-sm font-medium rounded-lg transition-colors
        ${
          activeSection === item.id
            ? "bg-indigo-600 text-white shadow-md"
            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        }
      `}
    >
      <span className="mr-3 text-lg">{item.icon}</span>
      {item.name}
    </button>
  );

  // ===============================================
  // === Section Components ===
  // ===============================================

  // ## Dashboard Overview
  const DashboardSection = () => (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Upcoming Sessions",
            value: mockData.stats.upcomingSessions,
            icon: "📅",
            color: "bg-blue-100 text-blue-800",
          },
          {
            label: "Total Earnings",
            value: formatCurrency(mockData.stats.totalEarnings),
            icon: "💸",
            color: "bg-green-100 text-green-800",
          },
          {
            label: "Pending Escrow",
            value: formatCurrency(mockData.stats.pendingEscrow),
            icon: "🔒",
            color: "bg-yellow-100 text-yellow-800",
          },
          {
            label: "Average Rating",
            value: `${mockData.stats.averageRating} / 5`,
            icon: "🌟",
            color: "bg-purple-100 text-purple-800",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl shadow-lg ${stat.color} flex items-center`}
          >
            <span className="text-3xl mr-4">{stat.icon}</span>
            <div>
              <p className="text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-extrabold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150">
              Set Availability
            </button>
            <button className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-150">
              Start Session (Next Up)
            </button>
            <button className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-150">
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Latest Bookings</h3>
          <ul className="space-y-3">
            {mockData.sessions.slice(0, 3).map((session) => (
              <li
                key={session.id}
                className="p-3 border-b last:border-b-0 text-gray-600 flex justify-between items-center"
              >
                <span>
                  {session.learner} at <strong>{session.time}</strong>
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    session.status === "upcoming"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {session.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // ## Support
  const SupportSection = () => (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Support & Help ❓</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQs and Tutorials */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">FAQs & Tutorials</h3>
          <ul className="list-disc list-inside space-y-2 text-indigo-600">
            <li>
              <a href="#" className="hover:underline">
                How to use WebRTC for Sessions
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Understanding Escrow & Payments
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Resolving common technical issues
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Best practices for rating management
              </a>
            </li>
          </ul>
        </div>

        {/* Dispute Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Dispute Form</h3>
          <p className="text-gray-600 mb-4">
            Please fill out this form to submit a dispute for a session. Include all relevant details
            and supporting files.
          </p>
          <form className="space-y-4">
            <select className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500">
              <option>Select Session ID</option>
              <option>#123</option>
              <option>#122</option>
            </select>
            <textarea
              rows="3"
              placeholder="Reason for dispute..."
              className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
            ></textarea>
            <input
              type="file"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Submit Dispute
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500">
            Tracked ticket <strong>#DISP-001</strong> is currently{" "}
            <span className="font-bold text-yellow-600">Under Review</span>.
          </p>
        </div>
      </div>
    </div>
  );

  // --- Helper to Render Active Section ---
  const renderSection = useCallback(() => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "profile":
        return <ProviderProfile />; // ✅ external file
      case "sessions":
        return <SessionsRoom sessions={mockData.sessions} />; // ✅ pass sessions
      case "earnings":
        return <Earnings formatCurrency={formatCurrency} />; // ✅ pass function
      case "ratings":
        return (
          <Ratings
            averageRating={mockData.stats.averageRating}
            reviews={mockData.reviews}
          />
        );
      case "analytics":
        return <AnalyticsSection />;
      case "support":
        return <SupportSection />;
      default:
        return <DashboardSection />;
    }
  }, [activeSection]);

  // ===============================================
  // === Main Layout Render ===
  // ===============================================
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-40 p-2 bg-indigo-600 text-white rounded-lg md:hidden shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* --- SIDEBAR --- */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300
          md:translate-x-0 md:static md:block shadow-xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6">
          <h1 className="text-2xl font-black text-indigo-600">Provider Portal</h1>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <div className="group" key={item.id}>
              <NavItem item={item} />
            </div>
          ))}
        </nav>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="pt-10 md:pt-0">{renderSection()}</div>
      </main>
    </div>
  );
};

export default TutorDashboard;
