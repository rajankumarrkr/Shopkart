const Review = require("../models/Review");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

/**
 * GET /api/reviews/:productId
 * Public — fetch all reviews for a product
 */
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/reviews/:productId
 * Protected — logged-in user submits a review (with optional media)
 */
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { productId } = req.params;

        if (!rating) {
            return res.status(400).json({ message: "Rating is required" });
        }

        // Upload media files to Cloudinary
        const mediaUrls = [];
        const mediaTypes = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const isVideo = file.mimetype.startsWith("video/");
                const resourceType = isVideo ? "video" : "image";

                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "shopkart_reviews", resource_type: resourceType },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(file.buffer);
                });

                mediaUrls.push(uploadResult.secure_url);
                mediaTypes.push(isVideo ? "video" : "image");
            }
        }

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating: Number(rating),
            comment: comment || "",
            mediaUrls,
            mediaTypes,
        });

        // Recalculate product's average rating
        const allReviews = await Review.find({ product: productId });
        const avgRating =
            allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(avgRating * 10) / 10,
        });

        const populated = await review.populate("user", "name email");

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
