const express = require("express");
const router = express.Router();
const { getReviews, addReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const reviewUpload = require("../middleware/reviewUpload");

// Public: get all reviews for a product
router.get("/:productId", getReviews);

// Protected: submit a review (with optional media)
router.post("/:productId", protect, reviewUpload.array("media", 5), addReview);

module.exports = router;
