import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, AlertCircle, Clock, Eye, FileText,
  User, Mail, Phone, MapPin, Calendar, Languages, Briefcase,
  Award, Image as ImageIcon, Filter, Search, ChevronDown, ChevronUp
} from "lucide-react";
import { adminVerificationAPI } from "../../services/api";

const ProviderReviewPanel = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: "Pending",
    search: "",
    page: 1,
    limit: 10,
  });
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionNotes, setActionNotes] = useState("");
  const [expandedProfile, setExpandedProfile] = useState(null);

  useEffect(() => {
    fetchProfiles();
    fetchStats();
  }, [filters.status, filters.page]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await adminVerificationAPI.getAllProfiles(filters);
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminVerificationAPI.getVerificationStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProfileDetails = async (profileId) => {
    try {
      const response = await adminVerificationAPI.getProfileDetails(profileId);
      setSelectedProfile(response.data.profile);
      setVerificationHistory(response.data.verificationHistory);
      setExpandedProfile(profileId);
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  const handleAction = async () => {
    if (!selectedProfile || !actionType) return;

    try {
      setLoading(true);
      const profileId = selectedProfile._id;

      switch (actionType) {
        case "approve":
          await adminVerificationAPI.approveProfile(profileId, actionNotes);
          break;
        case "reject":
          if (!actionNotes.trim()) {
            alert("Please provide a reason for rejection");
            return;
          }
          await adminVerificationAPI.rejectProfile(profileId, actionNotes);
          break;
        case "request-changes":
          if (!actionNotes.trim()) {
            alert("Please specify what changes are needed");
            return;
          }
          await adminVerificationAPI.requestChanges(profileId, actionNotes);
          break;
        default:
          break;
      }

      setShowModal(false);
      setActionNotes("");
      setActionType(null);
      setExpandedProfile(null);
      fetchProfiles();
      fetchStats();
    } catch (error) {
      console.error("Error performing action:", error);
      alert(error.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (profile, type) => {
    setSelectedProfile(profile);
    setActionType(type);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      Verified: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      Rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
      "Needs Info": { color: "bg-blue-100 text-blue-800", icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${config.color}`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Pending", value: stats.Pending || 0, color: "yellow" },
          { label: "Verified", value: stats.Verified || 0, color: "green" },
          { label: "Rejected", value: stats.Rejected || 0, color: "red" },
          { label: "Needs Info", value: stats["Needs Info"] || 0, color: "blue" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-md"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
            <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="Needs Info">Needs Info</option>
            </select>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={fetchProfiles}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Profiles List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No profiles found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile._id}
                  profile={profile}
                  isExpanded={expandedProfile === profile._id}
                  onExpand={() => fetchProfileDetails(profile._id)}
                  onCollapse={() => setExpandedProfile(null)}
                  onAction={openActionModal}
                  getStatusBadge={getStatusBadge}
                  verificationHistory={expandedProfile === profile._id ? verificationHistory : []}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 capitalize">
                {actionType === "approve" && "Approve Profile"}
                {actionType === "reject" && "Reject Profile"}
                {actionType === "request-changes" && "Request Changes"}
              </h3>

              <p className="text-gray-600 mb-4">
                Provider: <strong>{selectedProfile?.fullName}</strong>
              </p>

              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={
                  actionType === "approve"
                    ? "Optional approval notes..."
                    : actionType === "reject"
                    ? "Reason for rejection (required)..."
                    : "Specify what changes are needed (required)..."
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                required={actionType !== "approve"}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAction}
                  disabled={loading}
                  className={`flex-1 py-2 rounded-lg text-white font-semibold transition ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : actionType === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } disabled:opacity-50`}
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Profile Card Component
const ProfileCard = ({ profile, isExpanded, onExpand, onCollapse, onAction, getStatusBadge, verificationHistory }) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <img
            src={profile.photos?.profilePhoto || "/default-avatar.png"}
            alt={profile.fullName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{profile.fullName}</h3>
              {getStatusBadge(profile.verificationStatus)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                {profile.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                {profile.phone}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                Submitted: {new Date(profile.lastSubmissionAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <FileText size={14} />
                Submissions: {profile.submissionCount}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile.verificationStatus === "Pending" && (
            <>
              <button
                onClick={() => onAction(profile, "approve")}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button
                onClick={() => onAction(profile, "request-changes")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
              >
                <AlertCircle size={16} />
                Request Changes
              </button>
              <button
                onClick={() => onAction(profile, "reject")}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <XCircle size={16} />
                Reject
              </button>
            </>
          )}
          <button
            onClick={isExpanded ? onCollapse : onExpand}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <ProfileDetails profile={profile} verificationHistory={verificationHistory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Profile Details Component
const ProfileDetails = ({ profile, verificationHistory }) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <User size={18} />
          Personal Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Date of Birth:</span>
            <p className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-gray-600">Address:</span>
            <p className="font-medium">
              {profile.address.street}, {profile.address.city}, {profile.address.state}, {profile.address.country} - {profile.address.zipCode}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Briefcase size={18} />
          Professional Information
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-600">Languages:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.languages.map((lang, idx) => (
                <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Services:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.services.map((service, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {service}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Bio:</span>
            <p className="mt-1 text-gray-700">{profile.bio}</p>
          </div>
        </div>
      </div>

      {/* Certifications */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Award size={18} />
            Certifications
          </h4>
          <div className="space-y-2">
            {profile.certifications.map((cert, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium">{cert.name}</p>
                <p className="text-gray-600">{cert.issuingOrganization}</p>
                <p className="text-gray-500 text-xs">
                  Issued: {new Date(cert.issueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification History */}
      {verificationHistory && verificationHistory.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText size={18} />
            Verification History
          </h4>
          <div className="space-y-2">
            {verificationHistory.map((action, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{action.action}</p>
                    <p className="text-gray-600">By: {action.adminName}</p>
                    {action.notes && <p className="text-gray-700 mt-1">{action.notes}</p>}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(action.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Notes */}
      {profile.verificationNotes && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <h4 className="font-semibold text-gray-800 mb-2">Admin Notes</h4>
          <p className="text-sm text-gray-700">{profile.verificationNotes}</p>
        </div>
      )}
    </div>
  );
};

export default ProviderReviewPanel;
