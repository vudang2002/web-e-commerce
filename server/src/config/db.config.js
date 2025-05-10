// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("[DB Config] Attempting to connect to MongoDB...");
    console.log("[DB Config] MongoDB URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("[DB Config] MongoDB Connected:", conn.connection.host);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting MongoDB: ${error.message}`);
    process.exit(1); // Force stop the app if cannot connect to DB
  }
};

export default connectDB;
