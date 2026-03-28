const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema(
    {
        paymentInstructions: {
            type: String,
            default: "Please complete the secure payment via Razorpay to confirm your order."
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
