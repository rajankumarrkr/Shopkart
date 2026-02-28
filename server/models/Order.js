const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String
    },

    paymentScreenshot: {
      type: String
    },

    transactionId: {
      type: String
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Verification Pending", "Approved", "Rejected"],
      default: "Pending"
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);