const { MongoClient } = require("mongodb");

async function compareConnections() {
  console.log("🔍 Comparing MongoDB Connections...\n");

  const connections = [
    {
      name: "OLD DATABASE",
      uri: "mongodb+srv://huzaizqureshi_db_user:doherty4444@cluster0.kbjqt51.mongodb.net/AiAlchemist",
    },
    {
      name: "NEW DATABASE",
      uri: "mongodb+srv://shahhaseebahmadkhan9_db_user:AkwB7psyhTZ1lRql@cluster0.zurpwjp.mongodb.net/AiAlchemist",
    },
  ];

  for (const conn of connections) {
    console.log(`\n🧪 Testing ${conn.name}:`);
    console.log("🔗 URI:", conn.uri.replace(/\/\/.*@/, "//***:***@"));

    const client = new MongoClient(conn.uri, {
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    try {
      await client.connect();
      console.log("   ✅ Connection successful!");

      const db = client.db("AiAlchemist");
      await db.admin().ping();
      console.log("   ✅ Database ping successful!");

      // Check for users collection
      const collections = await db.listCollections().toArray();
      const hasUsers = collections.some((c) => c.name === "users");
      console.log("   📄 Collections:", collections.length);
      console.log("   👥 Has users collection:", hasUsers ? "YES" : "NO");

      if (hasUsers) {
        const userCount = await db.collection("users").countDocuments();
        console.log("   👤 User count:", userCount);
      }
    } catch (error) {
      console.log("   ❌ Connection failed:", error.message);
    }

    try {
      await client.close();
    } catch (e) {
      // Ignore close errors
    }
  }
}

compareConnections();
