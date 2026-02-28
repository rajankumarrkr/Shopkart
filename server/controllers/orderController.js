const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

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
      pincode
    } = req.body;

    if (!fullName || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "Shipping details required" });
    }

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    const orderItems = [];

    for (let item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}`
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
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

    // Clear Cart After Order Creation
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Upload Payment Screenshot + Transaction ID
 */
exports.uploadPaymentProof = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Payment screenshot required" });
    }

    // Upload screenshot to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = require("../config/cloudinary").uploader.upload_stream(
        { folder: "shopkart_payments" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    order.paymentScreenshot = uploadResult.secure_url;
    order.transactionId = transactionId;
    order.paymentStatus = "Verification Pending";

    await order.save();

    res.status(200).json({
      message: "Payment proof uploaded successfully",
      order
    });

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

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};