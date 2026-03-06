const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

/**
 * Create Product (Admin Only)
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      category,
      stock,
      images: bodyImages,
    } = req.body;

    if (!title || !description || !price || !category || !stock) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let imageUrls = [];

    // Handle file uploads if present
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "shopkart_products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        imageUrls.push(uploadResult.secure_url);
      }
    }
    // Fallback to body images if no files were uploaded
    else if (bodyImages) {
      imageUrls = Array.isArray(bodyImages) ? bodyImages : [bodyImages];
    }

    const product = await Product.create({
      title,
      description,
      price,
      discountPrice,
      category,
      stock,
      images: imageUrls,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Get All Products
 */
exports.getProducts = async (req, res) => {
  try {
    const { category, limit } = req.query;
    let query = {};
    if (category && category.toLowerCase() !== "all") {
      query.category = new RegExp(`^${category}$`, "i"); // Case-insensitive exact match
    }

    let productQuery = Product.find(query).sort({ createdAt: -1 });

    if (limit) {
      productQuery = productQuery.limit(parseInt(limit));
    }

    const products = await productQuery;

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get Single Product
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update Product (Admin Only)
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle file uploads if present
    if (req.files && req.files.length > 0) {
      let imageUrls = [];
      for (let file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "shopkart_products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageUrls.push(uploadResult.secure_url);
      }
      req.body.images = imageUrls;
    }

    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete Product (Admin Only)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};