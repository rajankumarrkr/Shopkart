const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Product = require("../models/Product");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const sampleProducts = [
    {
        title: "Elite Pro Ultrabook v4",
        description: "The ultimate productivity machine with an 8-core processor, 16GB RAM, and a stunning 4K Retina display. Designed for professionals who demand the best.",
        price: 1299,
        category: "Tech",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800"],
        stock: 50,
        rating: 4.8
    },
    {
        title: "Urban Minimalist Bomber",
        description: "A timeless classic reimagined for the modern street style. Water-resistant fabric, premium zippers, and a tailored fit that goes with everything.",
        price: 89,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800"],
        stock: 120,
        rating: 4.5
    },
    {
        title: "ZenFlow Organic Yoga Mat",
        description: "Eco-friendly, non-slip, and extra cushioned for your perfect flow. Made from sustainable natural rubber to support your practice and the planet.",
        price: 65,
        category: "Lifestyle",
        images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"],
        stock: 200,
        rating: 4.9
    },
    {
        title: "Nexus Scandi Sofa",
        description: "Minimalist design meets maximum comfort. This 3-seater features premium linen upholstery and solid oak legs, perfect for any modern living room.",
        price: 850,
        category: "Home",
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"],
        stock: 15,
        rating: 4.7
    },
    {
        title: "Velocity Wireless Headphones",
        description: "Experience sound like never before. 40-hour battery life, active noise cancellation, and deep bass that makes every track come alive.",
        price: 199,
        category: "Tech",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"],
        stock: 85,
        rating: 4.6
    }
];

const resetProducts = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        console.log("Clearing all existing products...");
        await Product.deleteMany({});
        console.log("Database cleared.");

        console.log("Inserting 5 curated products...");
        await Product.insertMany(sampleProducts);
        console.log("Successfully inserted 5 products!");

        process.exit(0);
    } catch (error) {
        console.error("Error resetting products:", error);
        process.exit(1);
    }
};

resetProducts();
