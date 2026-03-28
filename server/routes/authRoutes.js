const express = require("express");
const router = express.Router();
const { registerUser, loginUser, adminLoginUser } = require("../controllers/authController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Admin Login
router.post("/admin/login", adminLoginUser);

module.exports = router;