import React, { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import axios from "axios";
import {
  Star,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  Wallet,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Bell,
  User,
  Calendar,
  Star as StarIcon,
  MessageSquare,
  Video,
  Phone,
  Mic,
  MicOff,
  VideoOff,
  Video as VideoIcon,
  Paperclip,
  Smile,
  ThumbsUp,
  UserPlus,
  Users,
  Info,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Phone as PhoneOff,
  Volume2,
  VolumeX,
  Share2,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Tablet,
  Cast,
  Airplay,
  Copy,
  Check,
  AlertCircle,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Info as InfoIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus as UserPlusIcon,
  PlusCircle,
  MinusCircle,
  Trash2,
  Edit2,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  Sliders,
  Filter,
  Grid,
  List,
  LayoutDashboard,
  BarChart2,
  PieChart,
  LineChart,
  BarChart,
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ShoppingCart,
  ShoppingBag,
  Tag,
  Percent,
  Gift,
  Award as AwardIcon,
  Trophy,
  Medal,
  Flag,
  Heart,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown,
  MessageCircle as MessageCircleIcon,
  MessageSquare as MessageSquareIcon,
  MessageSquarePlus,
  MessageSquareText,
  MessageSquareX,
  MessageSquareCode,
  Search,
  FileText,
  Award
} from "lucide-react";

// Lazy load components for better performance
const Certificates = lazy(() => import("./Certificates"));
const SearchProvider = lazy(() => import("./SearchProviders"));
const LearnerProfile = lazy(() => import("./LearnerProfile"));
const LearnerSessionRoom = lazy(() => import("./LearnerSessionRoom"));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  in: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  out: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// Skeleton Loader Component
const SkeletonCard = () => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-2xl p-6 shadow-md overflow-hidden"
  >
    <div className="animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </motion.div>
);

// Loading Component
const LoadingSkeleton = ({ count = 3 }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);


// Feedback Component with improved animations
const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and feedback comment.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/feedback", {
        providerId: "123456", // placeholder
        rating,
        comment,
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
      setComment("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center px-4 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="max-w-lg w-full bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 transform transition-all duration-300 hover:shadow-2xl"
        whileHover={{ y: -5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          🌟 Rate Your Session
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Your feedback helps improve the quality of sessions and builds trusted
          reputation on-chain.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center text-center text-green-600">
            <CheckCircle size={48} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your feedback has been submitted successfully. Rating will be
              added to the provider's on-chain reputation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Rating stars */}
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={36}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`cursor-pointer transition-transform duration-200 ${
                    (hoverRating || rating) >= star
                      ? "text-yellow-400 scale-110"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Comment box */}
            <div className="mb-6">
              <label
                htmlFor="comment"
                className="block text-gray-700 font-medium mb-2"
              >
                Feedback Comments
              </label>
              <textarea
                id="comment"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={300}
                placeholder="Share your thoughts about the session..."
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              ></textarea>
              <p className="text-right text-xs text-gray-500 mt-1">
                {comment.length}/300 characters
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-all duration-200 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>

      {/* Blockchain Reputation Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center max-w-md"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          🔗 Blockchain Reputation System
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          All ratings are securely stored via the <b>Reputation Smart Contract</b>. 
          Each provider's overall score is immutable, transparent, and linked to 
          their wallet address.
        </p>
      </motion.div>
    </motion.div>
  );
};


// Enhanced Ratings Component with animations
const Ratings = () => {
  const [ratings, setRatings] = useState([
    {
      id: 13,
      providerName: "Rahul Sharma",
      providerPhoto: "https://randomuser.me/api/portraits/men/45.jpg",
      skill: "Blockchain Architecture",
      rating: 5,
      comment: "Outstanding mentor with deep knowledge of enterprise blockchain solutions. His guidance on Hyperledger Fabric was invaluable for our project!",
      timestamp: new Date(2024, 2, 25).toISOString(),
      onChainTxId: "0x1a2b...3c4d"
    },
    {
      id: 12,
      providerName: "Priyanka Patel",
      providerPhoto: "https://randomuser.me/api/portraits/women/33.jpg",
      skill: "Smart Contract Security",
      rating: 4,
      comment: "Excellent teacher who made complex security concepts easy to understand. Her real-world examples from DeFi projects were particularly helpful.",
      timestamp: new Date(2024, 3, 2).toISOString(),
      onChainTxId: "0x5e6f...7g8h"
    },
    {
      id: 1,
      providerName: "Alex Johnson",
      providerPhoto: "https://randomuser.me/api/portraits/men/32.jpg",
      skill: "Blockchain Development",
      rating: 5,
      comment: "Exceptional mentor with deep knowledge of smart contracts and DeFi protocols. Sessions are always productive!",
      timestamp: new Date(2024, 0, 15).toISOString(),
      onChainTxId: "0x1234...abcd"
    },
    {
      id: 2,
      providerName: "Sarah Williams",
      providerPhoto: "https://randomuser.me/api/portraits/women/44.jpg",
      skill: "Web3 Security",
      rating: 4,
      comment: "Great insights into smart contract security. Helped me understand common vulnerabilities.",
      timestamp: new Date(2024, 1, 2).toISOString(),
      onChainTxId: "0x5678...efgh"
    },
    {
      id: 3,
      providerName: "Michael Chen",
      providerPhoto: "https://randomuser.me/api/portraits/men/67.jpg",
      skill: "NFT Development",
      rating: 5,
      comment: "Amazing mentor! Explained complex NFT concepts in a simple way. Highly recommended!",
      timestamp: new Date(2024, 1, 10).toISOString(),
      onChainTxId: "0x9abc...ijkl"
    },
    {
      id: 4,
      providerName: "Priya Patel",
      providerPhoto: "https://randomuser.me/api/portraits/women/28.jpg",
      skill: "DeFi Strategies",
      rating: 5,
      comment: "Incredible depth of knowledge in DeFi. Sessions are always packed with valuable insights.",
      timestamp: new Date(2024, 1, 18).toISOString(),
      onChainTxId: "0xmnop...qrst"
    },
    {
      id: 5,
      providerName: "David Kim",
      providerPhoto: "https://randomuser.me/api/portraits/men/51.jpg",
      skill: "Smart Contract Auditing",
      rating: 4,
      comment: "Very thorough in explaining security best practices. Learned a lot about smart contract vulnerabilities.",
      timestamp: new Date(2024, 1, 22).toISOString(),
      onChainTxId: "0xuvwx...yz12"
    },
    {
      id: 6,
      providerName: "Emma Wilson",
      providerPhoto: "https://randomuser.me/api/portraits/women/36.jpg",
      skill: "Ethereum Development",
      rating: 5,
      comment: "Exceptional teacher with real-world experience. Her explanations of complex topics are crystal clear.",
      timestamp: new Date(2024, 2, 5).toISOString(),
      onChainTxId: "0x3456...7890"
    },
    {
      id: 7,
      providerName: "James Rodriguez",
      providerPhoto: "https://randomuser.me/api/portraits/men/29.jpg",
      skill: "Solidity Programming",
      rating: 4,
      comment: "Great at breaking down complex Solidity concepts. Very patient and knowledgeable.",
      timestamp: new Date(2024, 2, 8).toISOString(),
      onChainTxId: "0xabcd...efgh"
    },
    {
      id: 8,
      providerName: "Nina Zhang",
      providerPhoto: "https://randomuser.me/api/portraits/women/42.jpg",
      skill: "Layer 2 Solutions",
      rating: 5,
      comment: "Incredibly knowledgeable about Optimism and Arbitrum. Helped me implement my first L2 solution!",
      timestamp: new Date(2024, 2, 12).toISOString(),
      onChainTxId: "0xijkl...mnop"
    },
    {
      id: 9,
      providerName: "Carlos Mendez",
      providerPhoto: "https://randomuser.me/api/portraits/men/38.jpg",
      skill: "DAO Governance",
      rating: 4,
      comment: "Great insights into DAO operations and governance models. Very practical approach.",
      timestamp: new Date(2024, 2, 15).toISOString(),
      onChainTxId: "0xqrst...uvwx"
    },
    {
      id: 10,
      providerName: "Aisha Bello",
      providerPhoto: "https://randomuser.me/api/portraits/women/53.jpg",
      skill: "Zero-Knowledge Proofs",
      rating: 5,
      comment: "Mind-blowing knowledge of ZKPs! Made complex cryptographic concepts accessible and interesting.",
      timestamp: new Date(2024, 2, 20).toISOString(),
      onChainTxId: "0xyza1...bcd2"
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Keeping the effect in case you want to fetch from an API later
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        // This is now a fallback in case you want to fetch from an API
        // const res = await axios.get("/mockRatings.json");
        // setRatings(prev => [...prev, ...(res.data || [])]);
      } catch (err) {
        console.error("Error fetching ratings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 py-10">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            ⭐ Your Ratings & Reputation
          </motion.h1>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Track all sessions you've rated. Each rating contributes to the 
            decentralized <span className="font-semibold text-indigo-600">Reputation Smart Contract</span>.
          </motion.p>
        </motion.div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : Array.isArray(ratings) && ratings.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No ratings submitted yet.
          </div>
        ) : (
          <>
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {Array.isArray(ratings) && ratings.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                  layout
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={item.providerPhoto || "https://via.placeholder.com/70"}
                      alt={item.providerName}
                      className="w-14 h-14 rounded-full border-2 border-indigo-300 object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.providerName}
                      </h3>
                      <p className="text-sm text-gray-500">{item.skill || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        className={`${
                          s <= item.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {item.rating}/5
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    "{item.comment}"
                  </p>

                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>
                        {new Date(item.timestamp).toLocaleDateString()}{" "}
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {item.onChainTxId ? (
                      <a
                        href={`https://mumbai.polygonscan.com/tx/${item.onChainTxId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-500 hover:underline"
                      >
                        <Wallet size={12} />
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400">
                        <CheckCircle size={12} />
                        Off-chain
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {ratings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-8 text-center"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  📊 Reputation Summary
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Average rating across all sessions you've completed.
                </p>
                <div className="flex justify-center items-center gap-2">
                  <Star className="text-yellow-400" size={24} />
                  <span className="text-3xl font-bold text-gray-800">
                    {(
                      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                    ).toFixed(1)}
                  </span>
                  <span className="text-gray-500">/5</span>
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  * Immutable ratings stored on the Polygon Mumbai network.
                </p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};


// ===================== Dashboard Component =====================

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close mobile menu on window resize if it becomes desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
        setMobileMenuOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [activeSection, setActiveSection] = useState("profile");

  // Sidebar items
  const navItems = useMemo(
    () => [
      { name: "Profile", icon: User, section: "profile" },
      { name: "Session Room", icon: Calendar, section: "session" },
      { name: "Search Provider", icon: Search, section: "search" },
      { name: "Feedback", icon: FileText, section: "feedback" },
      { name: "Ratings", icon: StarIcon, section: "rating" },
      {
        name: "Certificates & Achievements",
        icon: Award,
        section: "certificates",
      },
    ],
    []
  );

  // Section renderer
  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <LearnerProfile />;
      case "session":
        return <LearnerSessionRoom />;
      case "search":
        return <SearchProvider />;
      case "feedback":
        return <Feedback />;
      case "rating":
        return <Ratings />;
      case "certificates":
        return <Certificates />;
      default:
        return <LearnerProfile />;
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white shadow-md text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || mobileMenuOpen) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className={`fixed lg:relative lg:flex lg:flex-shrink-0 inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl lg:shadow-md flex-col`}
          >
            <div className="p-6 border-b border-gray-100 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LearnChain
              </h1>
              <p className="text-sm text-gray-500 mt-1">Learner Dashboard</p>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-4">
              <nav className="space-y-2 w-full">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.section;
                  return (
                    <motion.div
                      key={item.section}
                      onClick={() => {
                        setActiveSection(item.section);
                        if (window.innerWidth < 1024) setMobileMenuOpen(false);
                      }}
                      className={`flex items-center px-6 py-3 rounded-lg transition-colors relative overflow-hidden group w-full max-w-[240px] mx-auto
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      whileHover={{ x: 4 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r-full"
                          initial={false}
                          transition={spring}
                        />
                      )}
                      <div className="flex items-center w-full">
                        <Icon 
                          className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} 
                          size={20} 
                        />
                        <span className="ml-3 text-sm text-center flex-1">{item.name}</span>
                        {isActive && (
                          <motion.div
                            className="w-2 h-2 bg-blue-500 rounded-full ml-2"
                            layoutId="activeDot"
                            initial={false}
                            transition={spring}
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </nav>
            </div>
            
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                  U
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">User Name</p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
                <ChevronDown className="ml-auto text-gray-400" size={16} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 h-full transition-all duration-300 flex flex-col w-full ${
        sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
      } overflow-hidden`}>
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-20 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-800">
                  {navItems.find(item => item.section === activeSection)?.name || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <Settings size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <HelpCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full h-full px-0 sm:px-0 lg:px-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full w-full"
              >
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                }>
                  <div className="w-full h-full">
                    {renderSection()}
                  </div>
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

// Spring animation config
const spring = {
  type: "spring",
  stiffness: 500,
  damping: 30
};

export default Dashboard;
