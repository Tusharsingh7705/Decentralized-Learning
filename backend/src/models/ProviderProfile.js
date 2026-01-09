// backend/src/models/ProviderProfile.js
const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Personal Information
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10,15}$/, "Please provide a valid phone number"],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function(value) {
          const age = (new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365);
          return age >= 18;
        },
        message: "Provider must be at least 18 years old",
      },
    },
    
    // Professional Information
    languages: {
      type: [String],
      required: [true, "At least one language is required"],
      validate: {
        validator: function(arr) {
          return arr && arr.length > 0;
        },
        message: "At least one language must be specified",
      },
    },
    services: {
      type: [String],
      required: [true, "At least one service is required"],
      validate: {
        validator: function(arr) {
          return arr && arr.length > 0;
        },
        message: "At least one service must be specified",
      },
    },
    certifications: [
      {
        name: { type: String, required: true },
        issuingOrganization: { type: String, required: true },
        issueDate: { type: Date, required: true },
        expiryDate: { type: Date },
        certificateUrl: { type: String },
      },
    ],
    bio: {
      type: String,
      required: [true, "Bio is required"],
      minlength: [50, "Bio must be at least 50 characters"],
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },
    
    // Documents & Media
    documents: {
      identityProof: {
        type: { type: String, enum: ["passport", "drivingLicense", "nationalId"] },
        fileUrl: { type: String },
        uploadedAt: { type: Date },
      },
      addressProof: {
        type: { type: String, enum: ["utilityBill", "bankStatement", "lease"] },
        fileUrl: { type: String },
        uploadedAt: { type: Date },
      },
      professionalCertificates: [
        {
          name: { type: String },
          fileUrl: { type: String },
          uploadedAt: { type: Date },
        },
      ],
    },
    photos: {
      profilePhoto: { type: String, required: [true, "Profile photo is required"] },
      additionalPhotos: [{ type: String }],
    },
    
    // Verification Status
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected", "Needs Info"],
      default: "Pending",
      required: true,
    },
    verificationNotes: {
      type: String,
      maxlength: 500,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: {
      type: Date,
    },
    
    // Resubmission Tracking
    submissionCount: {
      type: Number,
      default: 1,
    },
    lastSubmissionAt: {
      type: Date,
      default: Date.now,
    },
    resubmissionAllowedAt: {
      type: Date,
    },
    
    // Visibility Control
    isVisibleToLearners: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
providerProfileSchema.index({ userId: 1 });
providerProfileSchema.index({ verificationStatus: 1 });
providerProfileSchema.index({ email: 1 });

// Method to check if resubmission is allowed
providerProfileSchema.methods.canResubmit = function() {
  if (!this.resubmissionAllowedAt) return true;
  return new Date() >= this.resubmissionAllowedAt;
};

// Method to set resubmission cooldown (24 hours)
providerProfileSchema.methods.setResubmissionCooldown = function() {
  const cooldownHours = 24;
  this.resubmissionAllowedAt = new Date(Date.now() + cooldownHours * 60 * 60 * 1000);
};

// Update visibility based on verification status
providerProfileSchema.pre("save", function(next) {
  this.isVisibleToLearners = this.verificationStatus === "Verified";
  next();
});

const ProviderProfile = mongoose.model("ProviderProfile", providerProfileSchema);

module.exports = ProviderProfile;
