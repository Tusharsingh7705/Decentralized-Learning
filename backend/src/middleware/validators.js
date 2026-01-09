// backend/src/middleware/validators.js
const { body, param } = require("express-validator");

// Provider profile validation
exports.validateProviderProfile = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Please provide a valid phone number (10-15 digits)"),

  body("address.street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),

  body("address.city").trim().notEmpty().withMessage("City is required"),

  body("address.state").trim().notEmpty().withMessage("State is required"),

  body("address.country").trim().notEmpty().withMessage("Country is required"),

  body("address.zipCode")
    .trim()
    .notEmpty()
    .withMessage("Zip code is required"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Please provide a valid date")
    .custom((value) => {
      const age = (new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365);
      if (age < 18) {
        throw new Error("Provider must be at least 18 years old");
      }
      return true;
    }),

  body("languages")
    .isArray({ min: 1 })
    .withMessage("At least one language is required"),

  body("services")
    .isArray({ min: 1 })
    .withMessage("At least one service is required"),

  body("bio")
    .trim()
    .notEmpty()
    .withMessage("Bio is required")
    .isLength({ min: 50, max: 1000 })
    .withMessage("Bio must be between 50 and 1000 characters"),

  body("photos.profilePhoto")
    .notEmpty()
    .withMessage("Profile photo is required")
    .isURL()
    .withMessage("Profile photo must be a valid URL"),
];

// Admin verification validation
exports.validateVerificationAction = [
  param("id").isMongoId().withMessage("Invalid profile ID"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters"),
];

// Reject validation (notes required)
exports.validateRejection = [
  param("id").isMongoId().withMessage("Invalid profile ID"),

  body("notes")
    .trim()
    .notEmpty()
    .withMessage("Rejection reason is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Rejection reason must be between 10 and 1000 characters"),
];

// Request changes validation (notes required)
exports.validateRequestChanges = [
  param("id").isMongoId().withMessage("Invalid profile ID"),

  body("notes")
    .trim()
    .notEmpty()
    .withMessage("Please specify what changes are needed")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Change request must be between 10 and 1000 characters"),
];
