const express = require("express");
const router = express.Router();

const {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  approvePayment,
  rejectPayment,
  getUserOrders,
  getAllOrders
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ================= USER ROUTES =================

// Create order
router.post("/", protect, createOrder);

// Create Razorpay Order
router.post("/:orderId/razorpay", protect, createRazorpayOrder);

// Verify Razorpay Payment
router.post("/:orderId/verify", protect, verifyRazorpayPayment);

// Get logged-in user orders
router.get("/my-orders", protect, getUserOrders);


// ================= ADMIN ROUTES =================

// Get all orders
router.get("/", protect, adminOnly, getAllOrders);

// Approve payment
router.put("/:orderId/approve", protect, adminOnly, approvePayment);

// Reject payment
router.put("/:orderId/reject", protect, adminOnly, rejectPayment);

module.exports = router;