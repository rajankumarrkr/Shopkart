const express = require("express");
const router = express.Router();

const {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// Add to cart
router.post("/", protect, addToCart);

// Get logged-in user's cart
router.get("/", protect, getUserCart);

// Update item quantity
router.put("/", protect, updateCartItem);

// Remove specific item
router.delete("/:productId", protect, removeCartItem);

// Clear entire cart
router.delete("/", protect, clearCart);

module.exports = router;