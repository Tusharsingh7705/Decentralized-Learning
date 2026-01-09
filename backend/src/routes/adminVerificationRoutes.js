// backend/src/routes/adminVerificationRoutes.js
const express = require("express");
const router = express.Router();
const adminVerificationController = require("../controllers/adminVerificationController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const {
  validateVerificationAction,
  validateRejection,
  validateRequestChanges,
} = require("../middleware/validators");

// All routes are admin-only
router.use(authenticate);
router.use(authorizeRoles("admin"));

// Get profiles
router.get("/pending", adminVerificationController.getPendingProfiles);
router.get("/all", adminVerificationController.getAllProfiles);
router.get("/stats", adminVerificationController.getVerificationStats);
router.get("/:id", adminVerificationController.getProfileDetails);
router.get("/:id/history", adminVerificationController.getVerificationHistory);

// Verification actions
router.post(
  "/:id/approve",
  validateVerificationAction,
  adminVerificationController.approveProfile
);

router.post(
  "/:id/reject",
  validateRejection,
  adminVerificationController.rejectProfile
);

router.post(
  "/:id/request-changes",
  validateRequestChanges,
  adminVerificationController.requestChanges
);

module.exports = router;
