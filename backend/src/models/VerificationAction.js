// backend/src/models/VerificationAction.js
const mongoose = require("mongoose");

const verificationActionSchema = new mongoose.Schema(
  {
    providerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["Approved", "Rejected", "Requested Changes", "Reviewed"],
      required: true,
    },
    previousStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected", "Needs Info"],
      required: true,
    },
    newStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected", "Needs Info"],
      required: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    adminName: {
      type: String,
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
verificationActionSchema.index({ providerProfileId: 1, createdAt: -1 });
verificationActionSchema.index({ providerId: 1, createdAt: -1 });
verificationActionSchema.index({ adminId: 1, createdAt: -1 });

const VerificationAction = mongoose.model("VerificationAction", verificationActionSchema);

module.exports = VerificationAction;
