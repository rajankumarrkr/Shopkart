const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const adminEmail = "svcet"; // Using 'svcet' as email/ID
        const adminPassword = "svcet@123";

        let admin = await User.findOne({ email: adminEmail });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        if (admin) {
            admin.password = hashedPassword;
            admin.role = "admin";
            await admin.save();
            console.log("Admin user updated successfully");
        } else {
            await User.create({
                name: "Super Admin",
                email: adminEmail,
                password: hashedPassword,
                phone: "0000000000",
                role: "admin"
            });
            console.log("Admin user created successfully");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
