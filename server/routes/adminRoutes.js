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
        const { paymentInstructions } = req.body;
        let settings = await AdminSettings.findOne();

        if (!settings) {
            settings = new AdminSettings({});
        }

        settings.paymentInstructions = paymentInstructions || settings.paymentInstructions;

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
