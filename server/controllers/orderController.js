const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Order From Cart
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      totalAmount: clientTotal
    } = req.body;

    if (!fullName) return res.status(400).json({ message: "Full Name is required" });
    if (!phone) return res.status(400).json({ message: "Phone Number is required" });
    if (!address) return res.status(400).json({ message: "Address is required" });
    if (!city) return res.status(400).json({ message: "City is required" });
    if (!state) return res.status(400).json({ message: "State is required" });
    if (!pincode) return res.status(400).json({ message: "Pincode is required" });

    let orderItems = [];
    let calculatedTotal = 0;

    // 1. Check if items are provided in req.body (for localStorage carts)
    if (items && Array.isArray(items) && items.length > 0) {
      for (let item of items) {
        const product = await Product.findById(item._id || item.product);
        if (!product) {
          return res.status(404).json({ message: `Product not found: ${item.title}` });
        }

        const price = product.discountPrice || product.price;
        const qty = item.qty || item.quantity || 1;

        calculatedTotal += price * qty;
        orderItems.push({
          product: product._id,
          quantity: qty,
          price: price
        });
      }
    } else {
      // 2. Fallback to database cart
      const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "No items in cart to create order" });
      }

      for (let item of cart.items) {
        if (!item.product) continue;
        const price = item.product.discountPrice || item.product.price;
        calculatedTotal += price * item.quantity;
        orderItems.push({
          product: item.product._id,
          quantity: item.quantity,
          price: price
        });
      }

      // Clear DB Cart
      await Cart.findOneAndDelete({ user: req.user._id });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: clientTotal || calculatedTotal,
      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        state,
        pincode
      },
      paymentStatus: "Pending",
      orderStatus: "Pending"
    });

    res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create Razorpay Order
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const options = {
      amount: order.totalAmount * 100, // amount in paise
      currency: "INR",
      receipt: order._id.toString(),
    };

    const rzpOrder = await razorpay.orders.create(options);

    res.status(200).json({
      rzpOrder,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verify Razorpay Payment
 */
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const order = await Order.findById(orderId).populate("items.product");
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Reduce stock
      for (let item of order.items) {
        if (item.product) {
          const product = await Product.findById(item.product._id);
          if (product) {
            product.stock -= item.quantity;
            await product.save();
          }
        }
      }

      order.paymentStatus = "Approved";
      order.orderStatus = "Confirmed";
      order.transactionId = razorpay_payment_id;
      
      await order.save();
      
      return res.status(200).json({ message: "Payment verified successfully", order });
    } else {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Admin Approve Payment
 */
exports.approvePayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus !== "Verification Pending") {
      return res.status(400).json({ message: "Payment not pending verification" });
    }

    // Reduce stock
    for (let item of order.items) {
      const product = await Product.findById(item.product._id);
      product.stock -= item.quantity;
      await product.save();
    }

    order.paymentStatus = "Approved";
    order.orderStatus = "Confirmed";

    await order.save();

    res.status(200).json({
      message: "Payment approved and order confirmed",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Admin Reject Payment
 */
exports.rejectPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "Rejected";
    order.orderStatus = "Cancelled";

    await order.save();

    res.status(200).json({
      message: "Payment rejected and order cancelled",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get User Orders
 */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get All Orders (Admin)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { paymentStatus } = req.query;

    let filter = {};

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    console.log("Admin Orders Fetch - Count:", orders.length);
    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};