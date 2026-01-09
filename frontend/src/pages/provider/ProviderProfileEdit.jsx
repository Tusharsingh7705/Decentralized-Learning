import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { providerProfileAPI } from "../../services/api";
import ProviderRegistrationForm from "./ProviderRegistrationForm";

const ProviderProfileEdit = () => {
  const [profile, setProfile] = useState(null);
  const [resubmissionStatus, setResubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchProfile();
    checkResubmissionStatus();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await providerProfileAPI.getMyProfile();
      setProfile(response.data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkResubmissionStatus = async () => {
    try {
      const response = await providerProfileAPI.checkResubmissionStatus();
      setResubmissionStatus(response.data);
    } catch (error) {
      console.error("Error checking resubmission status:", error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      Pending: {
        color: "yellow",
        icon: Clock,
        title: "Pending Review",
        message: "Your profile is currently under review by our admin team.",
      },
      Verified: {
        color: "green",
        icon: CheckCircle,
        title: "Profile Verified",
        message: "Congratulations! Your profile has been approved and is now visible to learners.",
      },
      Rejected: {
        color: "red",
        icon: XCircle,
        title: "Profile Rejected",
        message: "Your profile was rejected. Please review the feedback and resubmit.",
      },
      "Needs Info": {
        color: "blue",
        icon: AlertCircle,
        title: "Additional Information Required",
        message: "Please update your profile with the requested information.",
      },
    };
    return configs[status] || configs.Pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Profile Found</h2>
          <p className="text-gray-600 mb-6">You haven't submitted a provider profile yet.</p>
          <button
            onClick={() => setShowEditForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Create Profile
          </button>
        </div>
        {showEditForm && (
          <div className="mt-6">
            <ProviderRegistrationForm onSuccess={() => { setShowEditForm(false); fetchProfile(); }} />
          </div>
        )}
      </div>
    );
  }

  const statusConfig = getStatusConfig(profile.verificationStatus);
  const StatusIcon = statusConfig.icon;
  const canEdit = ["Rejected", "Needs Info"].includes(profile.verificationStatus);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-${statusConfig.color}-50 border-l-4 border-${statusConfig.color}-500 p-6 rounded-lg mb-6`}
      >
        <div className="flex items-start gap-4">
          <StatusIcon size={32} className={`text-${statusConfig.color}-600 flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`text-xl font-bold text-${statusConfig.color}-800 mb-2`}>
              {statusConfig.title}
            </h3>
            <p className={`text-${statusConfig.color}-700 mb-3`}>{statusConfig.message}</p>
            
            {profile.verificationNotes && (
              <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">Admin Feedback:</p>
                <p className="text-sm text-gray-600">{profile.verificationNotes}</p>
              </div>
            )}

            {resubmissionStatus && !resubmissionStatus.canResubmit && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Clock size={16} className={`text-${statusConfig.color}-600`} />
                <span className={`text-${statusConfig.color}-700`}>
                  You can resubmit in {resubmissionStatus.waitTime} hours
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Profile Summary */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <img
              src={profile.photos?.profilePhoto || "/default-avatar.png"}
              alt={profile.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile.fullName}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">{profile.phone}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}>
                  {profile.verificationStatus}
                </span>
                <span className="text-sm text-gray-500">
                  Submission #{profile.submissionCount}
                </span>
              </div>
            </div>
          </div>

          {canEdit && resubmissionStatus?.canResubmit && (
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <RefreshCw size={20} />
              {showEditForm ? "Cancel Edit" : "Edit & Resubmit"}
            </button>
          )}
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
            <p className="text-gray-600">
              {profile.address.street}, {profile.address.city}, {profile.address.state},{" "}
              {profile.address.country} - {profile.address.zipCode}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Services</h3>
            <div className="flex flex-wrap gap-2">
              {profile.services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Bio</h3>
            <p className="text-gray-600">{profile.bio}</p>
          </div>

          {profile.certifications && profile.certifications.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Certifications</h3>
              <div className="space-y-2">
                {profile.certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                    <p className="text-xs text-gray-500">
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Last Submitted</p>
              <p className="font-medium">{new Date(profile.lastSubmissionAt).toLocaleString()}</p>
            </div>
            {profile.verifiedAt && (
              <div>
                <p className="text-sm text-gray-600">Reviewed On</p>
                <p className="font-medium">{new Date(profile.verifiedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && canEdit && resubmissionStatus?.canResubmit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ProviderRegistrationForm
            onSuccess={() => {
              setShowEditForm(false);
              fetchProfile();
              checkResubmissionStatus();
            }}
          />
        </motion.div>
      )}

      {/* Information Cards */}
      {profile.verificationStatus === "Pending" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Our admin team will review your profile within 24-48 hours</li>
            <li>• You'll receive a notification once the review is complete</li>
            <li>• If approved, your profile will be visible to learners immediately</li>
            <li>• If changes are needed, you'll be able to edit and resubmit</li>
          </ul>
        </div>
      )}

      {profile.verificationStatus === "Verified" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-2">You're all set!</h3>
          <p className="text-sm text-green-700">
            Your profile is now live and visible to learners. You can start receiving booking requests.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProviderProfileEdit;
