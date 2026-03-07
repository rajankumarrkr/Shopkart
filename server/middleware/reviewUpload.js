const multer = require("multer");

// Memory storage — we'll stream to Cloudinary
const storage = multer.memoryStorage();

// Accept images AND videos
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed"), false);
    }
};

// 50 MB limit to support short video clips
const reviewUpload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter,
});

module.exports = reviewUpload;
