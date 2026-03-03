const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../models/User");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const promoteToAdmin = async (email) => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = "admin";
        await user.save();

        console.log(`Successfully promoted ${user.name} (${email}) to admin!`);
        console.log("Please log out and log back in on the website to see the changes.");
        process.exit(0);
    } catch (error) {
        console.error("Error promoting user:", error);
        process.exit(1);
    }
};

// Replace with the user's email or provide as command line argument
const email = process.argv[2];
if (!email) {
    console.log("Please provide an email address: node promoteAdmin.js <email>");
    process.exit(1);
}

promoteToAdmin(email);
