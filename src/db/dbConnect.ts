import mongoose from "mongoose";

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("Please define the MONGODB_URI environment variable");
        }
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully:", connection);
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Failed to connect to the database");
    }
}

export default dbConnect;