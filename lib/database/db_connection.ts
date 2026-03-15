import mongoose from "mongoose";
import logger from "@/lib/logger";

const connectDB = async() => {
  const MONGO_URI = process.env.MONGODB_URI as string;

  try {
    await mongoose.connect(MONGO_URI);
    logger.info("MongoDB Connected");
  } catch (error) {
    logger.error("MongoDB Connection Error", error);
  }
}

export default connectDB;
