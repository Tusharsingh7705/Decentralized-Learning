// backend/src/controllers/adminVerificationController.js
const ProviderProfile = require("../models/ProviderProfile");
const VerificationAction = require("../models/VerificationAction");
const User = require("../models/User");
const NotificationService = require("../services/notificationService");

// Get all pending provider profiles
exports.getPendingProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const profiles = await ProviderProfile.find({
      verificationStatus: "Pending",
    })
      .populate("userId", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ lastSubmissionAt: -1 });

    const count = await ProviderProfile.countDocuments({
      verificationStatus: "Pending",
    });

    res.status(200).json({
      profiles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPending: count,
    });
  } catch (error) {
    console.error("Error fetching pending profiles:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all profiles with filters
exports.getAllProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};

    // Filter by status
    if (status && status !== "all") {
      query.verificationStatus = status;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const profiles = await ProviderProfile.find(query)
      .populate("userId", "name email")
      .populate("verifiedBy", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ lastSubmissionAt: -1 });

    const count = await ProviderProfile.countDocuments(query);

    // Get counts by status
    const statusCounts = await ProviderProfile.aggregate([
      {
        $group: {
          _id: "$verificationStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      profiles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProfiles: count,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single profile details with verification history
exports.getProfileDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await ProviderProfile.findById(id)
      .populate("userId", "name email walletAddress")
      .populate("verifiedBy", "name email");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Get verification history
    const verificationHistory = await VerificationAction.find({
      providerProfileId: id,
    })
      .populate("adminId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      profile,
      verificationHistory,
    });
  } catch (error) {
    console.error("Error fetching profile details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve provider profile
exports.approveProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.user.id;

    const profile = await ProviderProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const previousStatus = profile.verificationStatus;

    // Update profile
    profile.verificationStatus = "Verified";
    profile.verificationNotes = notes || "Profile approved";
    profile.verifiedBy = adminId;
    profile.verifiedAt = new Date();
    profile.isVisibleToLearners = true;

    await profile.save();

    // Update user verification status
    await User.findByIdAndUpdate(profile.userId, { isVerified: true });

    // Create verification action record
    const admin = await User.findById(adminId);
    await VerificationAction.create({
      providerProfileId: id,
      providerId: profile.userId,
      adminId,
      action: "Approved",
      previousStatus,
      newStatus: "Verified",
      notes: notes || "Profile approved",
      adminName: admin.name,
      adminEmail: admin.email,
    });

    // Notify provider
    await NotificationService.notifyProviderStatusChange(
      profile.userId,
      "Verified",
      notes,
      admin.name
    );

    res.status(200).json({
      message: "Profile approved successfully",
      profile,
    });
  } catch (error) {
    console.error("Error approving profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reject provider profile
exports.rejectProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.user.id;

    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const profile = await ProviderProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const previousStatus = profile.verificationStatus;

    // Update profile
    profile.verificationStatus = "Rejected";
    profile.verificationNotes = notes;
    profile.verifiedBy = adminId;
    profile.verifiedAt = new Date();
    profile.isVisibleToLearners = false;

    await profile.save();

    // Update user verification status
    await User.findByIdAndUpdate(profile.userId, { isVerified: false });

    // Create verification action record
    const admin = await User.findById(adminId);
    await VerificationAction.create({
      providerProfileId: id,
      providerId: profile.userId,
      adminId,
      action: "Rejected",
      previousStatus,
      newStatus: "Rejected",
      notes,
      adminName: admin.name,
      adminEmail: admin.email,
    });

    // Notify provider
    await NotificationService.notifyProviderStatusChange(
      profile.userId,
      "Rejected",
      notes,
      admin.name
    );

    res.status(200).json({
      message: "Profile rejected",
      profile,
    });
  } catch (error) {
    console.error("Error rejecting profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Request changes to provider profile
exports.requestChanges = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.user.id;

    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({
        message: "Please specify what changes are needed",
      });
    }

    const profile = await ProviderProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const previousStatus = profile.verificationStatus;

    // Update profile
    profile.verificationStatus = "Needs Info";
    profile.verificationNotes = notes;
    profile.verifiedBy = adminId;
    profile.verifiedAt = new Date();
    profile.isVisibleToLearners = false;

    await profile.save();

    // Create verification action record
    const admin = await User.findById(adminId);
    await VerificationAction.create({
      providerProfileId: id,
      providerId: profile.userId,
      adminId,
      action: "Requested Changes",
      previousStatus,
      newStatus: "Needs Info",
      notes,
      adminName: admin.name,
      adminEmail: admin.email,
    });

    // Notify provider
    await NotificationService.notifyProviderStatusChange(
      profile.userId,
      "Needs Info",
      notes,
      admin.name
    );

    res.status(200).json({
      message: "Changes requested successfully",
      profile,
    });
  } catch (error) {
    console.error("Error requesting changes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get verification statistics
exports.getVerificationStats = async (req, res) => {
  try {
    const stats = await ProviderProfile.aggregate([
      {
        $group: {
          _id: "$verificationStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalProfiles = await ProviderProfile.countDocuments();
    const recentActions = await VerificationAction.find()
      .populate("adminId", "name")
      .populate("providerId", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      stats: stats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      totalProfiles,
      recentActions,
    });
  } catch (error) {
    console.error("Error fetching verification stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get verification history for a profile
exports.getVerificationHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await VerificationAction.find({
      providerProfileId: id,
    })
      .populate("adminId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching verification history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
