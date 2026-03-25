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
 * Share Product (Dynamic Meta Tags)
 */
exports.shareProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const redirectUrl = req.query.redirect || "/";
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "";
    
    // Create an HTML string with Open Graph tags to be read by scrapers
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title} - ShopKart</title>
    <meta name="description" content="${product.description}">
    
    <!-- Open Graph Tags -->
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="ShopKart">
    <meta property="og:title" content="${product.title} - ShopKart">
    <meta property="og:description" content="${product.description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${redirectUrl}">
    
    <!-- Twitter Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${product.title} - ShopKart">
    <meta name="twitter:description" content="${product.description}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- Redirect for actual users clicking the link -->
    <meta http-equiv="refresh" content="0;url=${redirectUrl}">
    <script>window.location.href = "${redirectUrl}";</script>
</head>
<body>
    <p>Redirecting to <a href="${redirectUrl}">${product.title}</a>...</p>
</body>
</html>`;

    res.send(html);
  } catch (error) {
    res.status(500).send("Server Error");
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

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
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
      // If we have files, these are the new images
      req.body.images = imageUrls;
    } else if (req.body.images) {
      // If no files, ensure images from body is an array if provided
      req.body.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
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