import mongoose from "mongoose";

const coectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅✅ Database connected successfully");
    } catch (error) {
        console.log("❌❌ Database connection failed", error);
    }
}

export default coectDB;