const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema(
    {
        upiId: {
            type: String,
            required: true,
            default: "example@upi"
        },
        qrCodeUrl: {
            type: String,
            default: ""
        },
        paymentInstructions: {
            type: String,
            default: "Please pay the exact amount using the QR code or UPI ID above and upload the screenshot with Transaction ID."
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
