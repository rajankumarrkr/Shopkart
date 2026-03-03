const express = require("express");
const router = express.Router();
const AdminSettings = require("../models/AdminSettings");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");

// Get settings (Public or User-accessible for checkout)
router.get("/settings", protect, async (req, res) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = await AdminSettings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update settings (Admin Only)
router.put("/settings", protect, adminOnly, async (req, res) => {
    try {
        const { upiId, paymentInstructions } = req.body;
        let settings = await AdminSettings.findOne();

        if (!settings) {
            settings = new AdminSettings({});
        }

        settings.upiId = upiId || settings.upiId;
        settings.paymentInstructions = paymentInstructions || settings.paymentInstructions;

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Upload QR (Admin Only)
router.post("/settings/qr", protect, adminOnly, upload.single("qrCode"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "shopkart_admin" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = new AdminSettings({});
        }

        settings.qrCodeUrl = uploadResult.secure_url;
        await settings.save();

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
