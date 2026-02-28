const express = require("express");
const router = express.Router();

const {
  createOrder,
  uploadPaymentProof,
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

// Upload payment screenshot
router.post(
  "/:orderId/payment",
  protect,
  upload.single("paymentScreenshot"),
  uploadPaymentProof
);

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