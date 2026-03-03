const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Product = require("../models/Product");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const categories = [
    {
        name: "Tech",
        keywords: ["laptop", "smartphone", "smartwatch", "headphones", "keyboard", "monitor", "camera", "tablet"],
        baseTitle: "Elite ",
        baseDesc: "Next-generation technology designed for peak performance and reliability. Featuring cutting-edge components and a sleek aesthetic."
    },
    {
        name: "Fashion",
        keywords: ["shoes", "jacket", "watch", "handbag", "sunglasses", "tshirt", "sneakers", "jewelry"],
        baseTitle: "Urban ",
        baseDesc: "Stay ahead of the trends with our premium fashion collection. Crafted from high-quality materials for comfort and style."
    },
    {
        name: "Lifestyle",
        keywords: ["yoga", "fitness", "organic", "wellness", "lifestyle", "travel", "adventure", "gym"],
        baseTitle: "Pure ",
        baseDesc: "Enhance your daily routines with products that promote a balanced and vibrant lifestyle. Perfect for the modern achiever."
    },
    {
        name: "Home",
        keywords: ["furniture", "decor", "lighting", "kitchen", "bedding", "minimalist", "home-office", "interior"],
        baseTitle: "Nexus ",
        baseDesc: "Transform your living space into a sanctuary of comfort and modern design. Thoughtfully curated for every room."
    }
];

const seedProducts = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        // Clear existing products? (Optional, let's keep them and just add more)
        // await Product.deleteMany({});
        // console.log("Cleared existing products.");

        for (const cat of categories) {
            console.log(`Generating 2000 items for category: ${cat.name}...`);
            const products = [];

            for (let i = 1; i <= 2000; i++) {
                const keyword = cat.keywords[Math.floor(Math.random() * cat.keywords.length)];
                const price = Math.floor(Math.random() * 1500) + 49;
                const discountPercentage = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0;
                const discountPrice = discountPercentage > 0 ? Math.floor(price * (1 - discountPercentage / 100)) : null;

                products.push({
                    title: `${cat.baseTitle}${keyword.charAt(0).toUpperCase() + keyword.slice(1)} v${i}`,
                    description: `${cat.baseDesc} This ${keyword} offers unparalleled quality and value.`,
                    price: price,
                    discountPrice: discountPrice,
                    category: cat.name,
                    images: [`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=800&q=${keyword}`],
                    stock: Math.floor(Math.random() * 450) + 50,
                    rating: (Math.random() * 1.5 + 3.5).toFixed(1)
                });

                // Insert in batches of 500
                if (products.length === 500) {
                    await Product.insertMany(products);
                    console.log(`  Inserted 500 items for ${cat.name}...`);
                    products.length = 0; // Clear array
                }
            }

            if (products.length > 0) {
                await Product.insertMany(products);
                console.log(`  Inserted remaining items for ${cat.name}.`);
            }
        }

        console.log("All 8,000 products added successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedProducts();
