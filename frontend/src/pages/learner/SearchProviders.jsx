import React, { useEffect, useState } from "react";
import {
  Search,
  Star,
  Wallet,
  Globe,
  Clock,
  Briefcase,
  Filter,
  Calendar,
  Video,
  MessageSquare,
  X,
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";


/**
 * Enhanced SearchProvider Component
 * Features:
 * ✅ Live Search (name, skill, language, or keyword)
 * ✅ Filter by Skill, Rating, Rate Range
 * ✅ Sort by Rating or Price
 * ✅ Animated cards using Framer Motion
 * ✅ Booking button placeholder for WebRTC sessions
 * ✅ Chat initiation placeholder
 * ✅ Clean Tailwind UI with light theme and responsive layout
 */

const SearchProviders = () => {
  const [query, setQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [selectedSkill, setSelectedSkill] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [rateRange, setRateRange] = useState([0, 100]);

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        // Replace with backend API endpoint
        const res = await axios.get("/mockProviders.json");
        setProviders(res.data || []);
        setFilteredProviders(res.data || []);
      } catch (err) {
        console.error("Error fetching providers:", err);
        // Ensure state is always an array even on error
        setProviders([]);
        setFilteredProviders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  // Handle search + filters
  useEffect(() => {
    // Ensure providers is an array before filtering
    if (!Array.isArray(providers)) {
      setFilteredProviders([]);
      return;
    }

    let results = providers.filter((provider) => {
      const matchesQuery =
        provider.name.toLowerCase().includes(query.toLowerCase()) ||
        provider.skills.join(" ").toLowerCase().includes(query.toLowerCase()) ||
        provider.bio.toLowerCase().includes(query.toLowerCase());

      const matchesSkill = selectedSkill
        ? provider.skills.includes(selectedSkill)
        : true;

      const matchesRating = minRating
        ? provider.rating >= parseFloat(minRating)
        : true;

      const matchesRate =
        provider.rate >= rateRange[0] && provider.rate <= rateRange[1];

      return matchesQuery && matchesSkill && matchesRating && matchesRate;
    });

    if (sortBy === "rating") {
      results = results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "priceLow") {
      results = results.sort((a, b) => a.rate - b.rate);
    } else if (sortBy === "priceHigh") {
      results = results.sort((a, b) => b.rate - a.rate);
    }

    setFilteredProviders(results);
  }, [query, selectedSkill, minRating, sortBy, rateRange, providers]);

  const handleBookClick = (provider) => {
    setSelectedProvider(provider);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (bookingDetails) => {
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const updatedBookings = [...existingBookings, {
      id: `booking-${Date.now()}`,
      ...bookingDetails,
      createdAt: new Date().toISOString()
    }];
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
    setShowBookingModal(false);
  };

  const handleChat = (provider) => {
    alert(`Starting chat with ${provider.name}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🔍 Explore & Connect with Skill Providers
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Search, filter, and book live sessions instantly with verified
          professionals.
        </p>

        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Search bar */}
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-4 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, skill, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap gap-3 justify-center">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">All Skills</option>
              <option value="Solidity">Solidity</option>
              <option value="React">React</option>
              <option value="Rust">Rust</option>
              <option value="MERN Stack">MERN Stack</option>
              <option value="IPFS">IPFS</option>
              <option value="Web3.js">Web3.js</option>
              <option value="Ethers.js">Ethers.js</option>
              <option value="Hardhat">Hardhat</option>
              <option value="Security">Security</option>
              <option value="Truffle">Truffle</option>
              <option value="Ganache">Ganache</option>
              <option value="Figma">Figma</option>
              <option value="Web3 Design">Web3 Design</option>
              <option value="UI/UX">UI/UX</option>
              <option value="TailwindCSS">TailwindCSS</option>
              <option value="DeFi">DeFi</option>
              <option value="Web3.py">Web3.py</option>
              <option value="Blockchain Basics">Blockchain Basics</option>
              <option value="Ethereum">Ethereum</option>
              <option value="Smart Contracts">Smart Contracts</option>
              <option value="DApps">DApps</option>
              <option value="Teaching">Teaching</option>
              <option value="Blockchain">Blockchain</option>
              <option value="Architecture">Architecture</option>
              <option value="WebRTC">WebRTC</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">All Ratings</option>
              <option value="4">4★ & above</option>
              <option value="4.5">4.5★ & above</option>
              <option value="5">5★ only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Sort By</option>
              <option value="rating">Highest Rated</option>
              <option value="priceLow">Lowest Price</option>
              <option value="priceHigh">Highest Price</option>
            </select>
          </div>
        </div>

        {/* Rate Range Filter */}
        <div className="flex flex-col md:flex-row items-center gap-3 justify-center mb-10">
          <label className="text-sm font-medium text-gray-700">
            Rate Range:{" "}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={rateRange[1]}
            onChange={(e) => setRateRange([0, parseInt(e.target.value)])}
            className="w-48 accent-indigo-500"
          />
          <span className="text-sm text-gray-600">
            0 - {rateRange[1]} MATIC/hr
          </span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center text-gray-600 text-lg">Loading...</div>
        )}

        {/* No results */}
        {!loading && Array.isArray(filteredProviders) && filteredProviders.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            No matching providers found 😕
          </div>
        )}

        {/* Provider cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(filteredProviders) && filteredProviders.map((provider, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={provider.photo || "https://via.placeholder.com/80"}
                  alt={provider.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-300"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {provider.name}
                  </h3>
                  <p className="text-sm text-gray-500">{provider.title}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {provider.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {provider.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" />
                  <span>{provider.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-indigo-500">
                  <Wallet size={12} />
                  <span>{provider.rate} MATIC/hr</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={12} />
                  <span>{provider.experience} yrs</span>
                </div>
              </div>

              {/* Extra Info */}
              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{provider.availability}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe size={12} />
                  <span>{provider.language}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => handleBook(provider)}
                  className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-3 py-2 rounded-xl w-1/2 transition-all"
                >
                  <Calendar size={16} /> Book
                </button>
                <button
                  onClick={() => handleChat(provider)}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-2 rounded-xl w-1/2 transition-all"
                >
                  <MessageSquare size={16} /> Chat
                </button>
              </div>

              {/* Optional: Join Session Placeholder */}
              <button
                onClick={() => alert(`Joining live session with ${provider.name}`)}
                className="mt-3 flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-xl transition-all"
              >
                <Video size={16} /> Join Session
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchProviders;
