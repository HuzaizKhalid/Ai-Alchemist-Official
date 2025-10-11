const { MongoClient, ObjectId } = require("mongodb");

async function testCalendarData() {
  const client = new MongoClient(
    "mongodb+srv://shahhaseebahmadkhan9_db_user:1234Dvorak$@cluster0.igtsejk.mongodb.net/"
  );

  try {
    await client.connect();
    const db = client.db("AiAlchemist");

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(
      "📁 Available collections:",
      collections.map((c) => c.name)
    );

    // Check searches collection
    const searchesCount = await db.collection("searches").countDocuments();
    console.log("🔍 Total searches:", searchesCount);

    if (searchesCount > 0) {
      // Get a sample search
      const sampleSearch = await db.collection("searches").findOne({});
      console.log(
        "📝 Sample search document:",
        JSON.stringify(sampleSearch, null, 2)
      );

      // Test the actual aggregation query
      const userId = "68c300970c0be93499e2aab0"; // Use the user ID from the logs
      const yearStart = new Date("2025-01-01T00:00:00.000Z");
      const yearEnd = new Date("2025-12-31T23:59:59.999Z");

      console.log("📅 Testing aggregation for user:", userId);
      console.log("📅 Date range:", yearStart, "to", yearEnd);

      const yearlyStats = await db
        .collection("searches")
        .aggregate([
          {
            $match: {
              userId: new ObjectId(userId),
              createdAt: { $gte: yearStart, $lte: yearEnd },
            },
          },
          {
            $group: {
              _id: null,
              totalSearches: { $sum: 1 },
              totalTokens: { $sum: "$environmental.tokenCount" },
              totalEnergyUsage: { $sum: "$environmental.energyUsage" },
              totalCarbonEmissions: { $sum: "$environmental.carbonEmissions" },
              totalWaterUsage: { $sum: "$environmental.waterUsage" },
            },
          },
        ])
        .toArray();

      console.log(
        "📊 Yearly stats result:",
        JSON.stringify(yearlyStats, null, 2)
      );

      // Test daily aggregation
      const dailyUsage = await db
        .collection("searches")
        .aggregate([
          {
            $match: {
              userId: new ObjectId(userId),
              createdAt: { $gte: yearStart, $lte: yearEnd },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              searchCount: { $sum: 1 },
              tokenCount: { $sum: "$environmental.tokenCount" },
              energyUsage: { $sum: "$environmental.energyUsage" },
              carbonEmissions: { $sum: "$environmental.carbonEmissions" },
              waterUsage: { $sum: "$environmental.waterUsage" },
            },
          },
        ])
        .toArray();

      console.log(
        "📈 Daily usage result:",
        JSON.stringify(dailyUsage, null, 2)
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

testCalendarData();
