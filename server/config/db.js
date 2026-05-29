import mongoose from "mongoose";

let memoryServer = null;

const connectWithUri = async (uri) => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000
  });
  console.log("MongoDB Connected");
};

const startMemoryServer = async () => {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const binaryVersion = process.env.MONGOMS_VERSION || "7.0.14";
  if (process.env.MONGOMS_MD5_CHECK === undefined) {
    process.env.MONGOMS_MD5_CHECK = "false";
  }
  memoryServer = await MongoMemoryServer.create({
    binary: { version: binaryVersion }
  });
  const uri = memoryServer.getUri();
  await connectWithUri(uri);
  console.warn("Using in-memory MongoDB (local dev fallback). Data resets when the server stops.");
  console.warn("For persistent Atlas data, whitelist your IP: https://www.mongodb.com/docs/atlas/security-whitelist/");
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const isProduction = process.env.NODE_ENV === "production";
  const allowMemoryFallback =
    !isProduction && process.env.DISABLE_MEMORY_MONGO !== "true";

  if (!mongoUri && !allowMemoryFallback) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  if (mongoUri) {
    try {
      await connectWithUri(mongoUri);
      return;
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      if (!allowMemoryFallback) {
        throw error;
      }
      console.warn("Atlas unreachable — falling back to in-memory MongoDB for local development.");
    }
  }

  await startMemoryServer();
};

export default connectDB;
