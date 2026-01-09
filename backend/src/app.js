// backend/src/app.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const providerProfileRoutes = require("./routes/providerProfileRoutes");
const adminVerificationRoutes = require("./routes/adminVerificationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/provider-profiles", providerProfileRoutes);
app.use("/api/admin/verification", adminVerificationRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;
