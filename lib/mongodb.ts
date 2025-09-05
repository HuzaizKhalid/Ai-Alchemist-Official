import { MongoClient, type Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI environment variable");
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
console.log("🔗 MongoDB URI configured:", uri.replace(/\/\/.*@/, "//***:***@")); // Hide credentials in logs

const options = {
  tls: uri.includes("mongodb+srv") ? true : false, // Only use TLS for cloud connections
  tlsAllowInvalidCertificates: !uri.includes("mongodb+srv"), // Allow invalid certs for local/dev only
  tlsAllowInvalidHostnames: !uri.includes("mongodb+srv"), // Allow invalid hostnames for local/dev only
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  console.log("🔧 Setting up MongoDB connection for development...");
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    console.log("🆕 Creating new MongoDB connection...");
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().then((client) => {
      console.log("✅ MongoDB connected successfully in development mode!");
      return client;
    }).catch((error) => {
      console.error("❌ MongoDB connection failed:", error.message);
      throw error;
    });
  } else {
    console.log("🔄 Reusing existing MongoDB connection...");
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  console.log("🚀 Setting up MongoDB connection for production...");
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then((client) => {
    console.log("✅ MongoDB connected successfully in production mode!");
    return client;
  }).catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  });
}

export async function getDatabase(): Promise<Db> {
  try {
    console.log("🔍 Getting database connection...");
    const client = await clientPromise;
    const db = client.db("AiAlchemist");
    console.log("📊 Connected to database:", db.databaseName);
    return db;
  } catch (error) {
    console.error("❌ Failed to get database:", error);
    throw error;
  }
}

// Test connection on startup
const testConnection = async () => {
  try {
    console.log("🧪 Testing MongoDB connection on startup...");
    await clientPromise;
    console.log("✅ MongoDB startup connection test passed!");
  } catch (error) {
    console.error("❌ MongoDB startup connection test failed:", error);
  }
};

// Run connection test in development
if (process.env.NODE_ENV === "development") {
  testConnection();
}

export default clientPromise;
