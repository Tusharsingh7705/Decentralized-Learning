// backend/src/models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ["admin", "provider", "learner"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "provider_pending",
        "provider_approved",
        "provider_rejected",
        "provider_needs_info",
        "profile_submitted",
        "profile_resubmitted",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedEntityType",
    },
    relatedEntityType: {
      type: String,
      enum: ["ProviderProfile", "User", "VerificationAction"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientRole: 1, createdAt: -1 });

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
