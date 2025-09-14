// Reset search count for today's active user
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function resetTodayUser() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("AiAlchemist");
    const users = db.collection("users");

    // Reset the user who has used searches today
    const result = await users.updateOne(
      { email: "huzaizqureshi@gmail.com" },
      {
        $set: {
          searchesUsed: 0,
          searchesResetDate: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount > 0) {
      console.log(
        "✅ Search count reset successfully for huzaizqureshi@gmail.com!"
      );
      console.log("🆕 You can now make searches again");

      // Show updated status
      const user = await users.findOne({ email: "huzaizqureshi@gmail.com" });
      console.log(
        `📊 Current status: ${user.searchesUsed}/50 searches available (dev mode)`
      );
    } else {
      console.log("❌ User not found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

resetTodayUser();
