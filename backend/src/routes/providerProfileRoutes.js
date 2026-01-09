// backend/src/routes/providerProfileRoutes.js
const express = require("express");
const router = express.Router();
const providerProfileController = require("../controllers/providerProfileController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { validateProviderProfile } = require("../middleware/validators");

// Provider routes (protected, provider only)
router.post(
  "/submit",
  authenticate,
  authorizeRoles("provider"),
  validateProviderProfile,
  providerProfileController.submitProfile
);

router.get(
  "/my-profile",
  authenticate,
  authorizeRoles("provider"),
  providerProfileController.getMyProfile
);

router.put(
  "/update",
  authenticate,
  authorizeRoles("provider"),
  validateProviderProfile,
  providerProfileController.updateProfile
);

router.get(
  "/resubmission-status",
  authenticate,
  authorizeRoles("provider"),
  providerProfileController.checkResubmissionStatus
);

// Public/Learner routes
router.get(
  "/verified",
  authenticate,
  providerProfileController.getVerifiedProviders
);

router.get(
  "/:id",
  authenticate,
  providerProfileController.getProfileById
);

module.exports = router;
