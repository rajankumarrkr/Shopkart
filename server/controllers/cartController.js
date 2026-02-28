const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * Add To Cart
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product and quantity required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json({
      message: "Item added to cart",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get User Cart
 */
exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update Cart Item Quantity
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res.status(400).json({ message: "Product and quantity required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove Item From Cart
 */
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Clear Cart
 */
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(200).json({ message: "Cart cleared successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};