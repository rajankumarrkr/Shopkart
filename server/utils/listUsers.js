const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../models/User");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const listUsers = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        const users = await User.find({}, "name email role");
        console.log("\nRegistered Users:");
        console.log("-----------------");
        users.forEach(u => {
            console.log(`Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error listing users:", error);
        process.exit(1);
    }
};

listUsers();
