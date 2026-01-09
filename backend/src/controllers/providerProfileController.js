// backend/src/controllers/providerProfileController.js
const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");
const NotificationService = require("../services/notificationService");
const { validationResult } = require("express-validator");

// Submit or update provider profile
exports.submitProfile = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const profileData = req.body;

    // Check if user is a provider
    const user = await User.findById(userId);
    if (!user || user.role !== "provider") {
      return res.status(403).json({ message: "Only providers can submit profiles" });
    }

    // Check for existing profile
    let profile = await ProviderProfile.findOne({ userId });

    if (profile) {
      // Check if resubmission is allowed
      if (!profile.canResubmit()) {
        const waitTime = Math.ceil(
          (profile.resubmissionAllowedAt - new Date()) / (1000 * 60 * 60)
        );
        return res.status(429).json({
          message: `Please wait ${waitTime} hours before resubmitting`,
          resubmissionAllowedAt: profile.resubmissionAllowedAt,
        });
      }

      // Update existing profile
      Object.assign(profile, profileData);
      profile.verificationStatus = "Pending";
      profile.submissionCount += 1;
      profile.lastSubmissionAt = new Date();
      profile.setResubmissionCooldown();

      await profile.save();

      // Notify admins of resubmission
      await NotificationService.notifyAdminResubmission(profile, userId);

      return res.status(200).json({
        message: "Profile resubmitted successfully",
        profile,
      });
    } else {
      // Create new profile
      profile = new ProviderProfile({
        userId,
        ...profileData,
      });

      await profile.save();

      // Notify admins of new submission
      await NotificationService.notifyAdminNewProvider(profile, userId);

      return res.status(201).json({
        message: "Profile submitted successfully",
        profile,
      });
    }
  } catch (error) {
    console.error("Error submitting profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get provider's own profile
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await ProviderProfile.findOne({ userId }).populate(
      "userId",
      "name email"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get profile by ID (for learners to view verified providers)
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await ProviderProfile.findById(id).populate(
      "userId",
      "name email rating totalSessions"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Only show verified profiles to learners
    if (req.user.role === "learner" && profile.verificationStatus !== "Verified") {
      return res.status(403).json({ message: "Profile not available" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all verified providers (for learners)
exports.getVerifiedProviders = async (req, res) => {
  try {
    const { page = 1, limit = 10, services, languages } = req.query;

    const query = {
      verificationStatus: "Verified",
      isVisibleToLearners: true,
    };

    // Filter by services
    if (services) {
      query.services = { $in: services.split(",") };
    }

    // Filter by languages
    if (languages) {
      query.languages = { $in: languages.split(",") };
    }

    const profiles = await ProviderProfile.find(query)
      .populate("userId", "name email rating totalSessions hourlyRate")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await ProviderProfile.countDocuments(query);

    res.status(200).json({
      profiles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProfiles: count,
    });
  } catch (error) {
    console.error("Error fetching verified providers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update profile (for providers to edit after rejection)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const profile = await ProviderProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Only allow updates if status is Rejected or Needs Info
    if (!["Rejected", "Needs Info"].includes(profile.verificationStatus)) {
      return res.status(400).json({
        message: "Profile can only be edited when rejected or needs info",
      });
    }

    // Check resubmission cooldown
    if (!profile.canResubmit()) {
      const waitTime = Math.ceil(
        (profile.resubmissionAllowedAt - new Date()) / (1000 * 60 * 60)
      );
      return res.status(429).json({
        message: `Please wait ${waitTime} hours before resubmitting`,
        resubmissionAllowedAt: profile.resubmissionAllowedAt,
      });
    }

    Object.assign(profile, updates);
    profile.verificationStatus = "Pending";
    profile.submissionCount += 1;
    profile.lastSubmissionAt = new Date();
    profile.setResubmissionCooldown();

    await profile.save();

    // Notify admins
    await NotificationService.notifyAdminResubmission(profile, userId);

    res.status(200).json({
      message: "Profile updated and resubmitted successfully",
      profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check resubmission status
exports.checkResubmissionStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await ProviderProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const canResubmit = profile.canResubmit();
    const waitTime = canResubmit
      ? 0
      : Math.ceil((profile.resubmissionAllowedAt - new Date()) / (1000 * 60 * 60));

    res.status(200).json({
      canResubmit,
      waitTime,
      resubmissionAllowedAt: profile.resubmissionAllowedAt,
      submissionCount: profile.submissionCount,
      verificationStatus: profile.verificationStatus,
    });
  } catch (error) {
    console.error("Error checking resubmission status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
