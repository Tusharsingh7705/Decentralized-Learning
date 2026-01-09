// backend/src/services/notificationService.js
const Notification = require("../models/Notification");

class NotificationService {
  // Create notification for new provider submission
  static async notifyAdminNewProvider(providerProfile, providerId) {
    try {
      // Get all admin users
      const User = require("../models/User");
      const admins = await User.find({ role: "admin" });

      const notifications = admins.map((admin) => ({
        recipientId: admin._id,
        recipientRole: "admin",
        type: "provider_pending",
        title: "New Provider Registration Pending",
        message: `${providerProfile.fullName} has submitted their profile for verification.`,
        relatedEntityId: providerProfile._id,
        relatedEntityType: "ProviderProfile",
        metadata: {
          providerName: providerProfile.fullName,
          providerEmail: providerProfile.email,
          submittedAt: providerProfile.createdAt,
        },
      }));

      await Notification.insertMany(notifications);
      return notifications;
    } catch (error) {
      console.error("Error creating admin notification:", error);
      throw error;
    }
  }

  // Notify provider of status change
  static async notifyProviderStatusChange(providerId, status, notes, adminName) {
    try {
      const typeMap = {
        Verified: "provider_approved",
        Rejected: "provider_rejected",
        "Needs Info": "provider_needs_info",
      };

      const titleMap = {
        Verified: "Profile Approved! 🎉",
        Rejected: "Profile Rejected",
        "Needs Info": "Additional Information Required",
      };

      const messageMap = {
        Verified: "Congratulations! Your provider profile has been approved. You are now visible to learners.",
        Rejected: `Your profile has been rejected. ${notes ? `Reason: ${notes}` : "Please contact support for more information."}`,
        "Needs Info": `Your profile requires additional information. ${notes || "Please review and resubmit."}`,
      };

      const notification = await Notification.create({
        recipientId: providerId,
        recipientRole: "provider",
        type: typeMap[status],
        title: titleMap[status],
        message: messageMap[status],
        metadata: {
          status,
          notes,
          reviewedBy: adminName,
          reviewedAt: new Date(),
        },
      });

      return notification;
    } catch (error) {
      console.error("Error creating provider notification:", error);
      throw error;
    }
  }

  // Notify admin of profile resubmission
  static async notifyAdminResubmission(providerProfile, providerId) {
    try {
      const User = require("../models/User");
      const admins = await User.find({ role: "admin" });

      const notifications = admins.map((admin) => ({
        recipientId: admin._id,
        recipientRole: "admin",
        type: "profile_resubmitted",
        title: "Provider Profile Resubmitted",
        message: `${providerProfile.fullName} has resubmitted their profile for review.`,
        relatedEntityId: providerProfile._id,
        relatedEntityType: "ProviderProfile",
        metadata: {
          providerName: providerProfile.fullName,
          providerEmail: providerProfile.email,
          submissionCount: providerProfile.submissionCount,
          resubmittedAt: new Date(),
        },
      }));

      await Notification.insertMany(notifications);
      return notifications;
    } catch (error) {
      console.error("Error creating resubmission notification:", error);
      throw error;
    }
  }

  // Get notifications for a user
  static async getUserNotifications(userId, options = {}) {
    try {
      const { limit = 20, skip = 0, unreadOnly = false } = options;

      const query = { recipientId: userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const unreadCount = await Notification.countDocuments({
        recipientId: userId,
        isRead: false,
      });

      return { notifications, unreadCount };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        recipientId: userId,
      });

      if (!notification) {
        throw new Error("Notification not found");
      }

      await notification.markAsRead();
      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { recipientId: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return result;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }
}

module.exports = NotificationService;
