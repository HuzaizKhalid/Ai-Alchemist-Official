const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function detailedConnectionTest() {
  console.log("🔍 Detailed MongoDB Connection Test...\n");

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is not set");
    return;
  }

  const uri = process.env.MONGODB_URI;
  console.log(
    "🔗 Testing connection to:",
    uri.replace(/\/\/.*@/, "//***:***@")
  );

  // Parse the URI to get cluster info
  const urlParts = uri.match(/cluster0\.(\w+)\.mongodb\.net/);
  if (urlParts) {
    console.log("🌐 Cluster ID:", urlParts[1]);
  }

  // Test with different SSL options
  const testConfigs = [
    {
      name: "Standard SSL",
      options: {
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      },
    },
    {
      name: "Relaxed SSL",
      options: {
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      },
    },
    {
      name: "No SSL",
      options: {
        tls: false,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      },
    },
  ];

  for (const config of testConfigs) {
    console.log(`\n🧪 Testing with ${config.name}...`);

    const client = new MongoClient(uri, config.options);

    try {
      console.log("   📡 Connecting...");
      await client.connect();

      console.log("   ✅ Connection successful!");

      const db = client.db("AiAlchemist");
      console.log("   🏓 Pinging database...");
      await db.admin().ping();

      console.log("   ✅ Database ping successful!");
      console.log("   📊 Connected to database:", db.databaseName);

      // List collections
      const collections = await db.listCollections().toArray();
      console.log("   📄 Collections found:", collections.length);

      if (collections.length > 0) {
        console.log(
          "   📝 Collection names:",
          collections.map((c) => c.name).join(", ")
        );
      }

      // If we get here, this configuration works
      console.log(`   🎉 SUCCESS with ${config.name} configuration!`);
      await client.close();
      return config;
    } catch (error) {
      console.log(`   ❌ Failed with ${config.name}:`, error.message);

      if (error.message.includes("authentication failed")) {
        console.log("   🔑 This looks like a credentials issue");
      } else if (
        error.message.includes("SSL") ||
        error.message.includes("TLS")
      ) {
        console.log("   🔒 This looks like an SSL/TLS issue");
      } else if (error.message.includes("timeout")) {
        console.log("   ⏱️ This looks like a network timeout issue");
      }

      try {
        await client.close();
      } catch (closeError) {
        // Ignore close errors
      }
    }
  }

  console.log("\n❌ All connection attempts failed");
  console.log("\n💡 Troubleshooting suggestions:");
  console.log("   1. Check if the username/password are correct");
  console.log("   2. Verify the cluster URL is correct");
  console.log("   3. Ensure your IP address is whitelisted in MongoDB Atlas");
  console.log("   4. Check if the database user has proper permissions");
  console.log("   5. Verify the cluster is running and accessible");
}

detailedConnectionTest();
