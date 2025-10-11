const { MongoClient, ObjectId } = require("mongodb");

async function testCalendarAPI() {
  console.log("🧪 Testing Calendar API logic...");

  const client = new MongoClient(
    "mongodb+srv://shahhaseebahmadkhan9_db_user:1234Dvorak$@cluster0.igtsejk.mongodb.net/"
  );

  try {
    await client.connect();
    const db = client.db("AiAlchemist");
    const searches = db.collection("searches");

    const userId = "68c300970c0be93499e2aab0";
    const year = "2025";
    const date = "2025-10-01";

    // Replicate the API logic exactly
    const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
    const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`);

    console.log("📅 Year range:", yearStart, "to", yearEnd);
    console.log("📅 Specific date:", date);
    console.log("📅 User ID:", userId);

    // Get yearly stats
    const yearlyStats = await searches
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

    // Get daily usage
    const dailyUsage = await searches
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
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    // Get specific date usage
    let specificDateUsage = null;
    if (date) {
      const dateStart = new Date(`${date}T00:00:00.000Z`);
      const dateEnd = new Date(`${date}T23:59:59.999Z`);

      console.log("📅 Date range for specific date:", dateStart, "to", dateEnd);

      const dateStats = await searches
        .aggregate([
          {
            $match: {
              userId: new ObjectId(userId),
              createdAt: { $gte: dateStart, $lte: dateEnd },
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

      specificDateUsage = dateStats[0] || {
        totalSearches: 0,
        totalTokens: 0,
        totalEnergyUsage: 0,
        totalCarbonEmissions: 0,
        totalWaterUsage: 0,
      };
    }

    // Format daily usage as map
    const dailyUsageMap = {};
    dailyUsage.forEach((day) => {
      dailyUsageMap[day._id] = {
        searchCount: day.searchCount,
        tokenCount: day.tokenCount,
        energyUsage: day.energyUsage,
        carbonEmissions: day.carbonEmissions,
        waterUsage: day.waterUsage,
      };
    });

    const result = {
      success: true,
      year: parseInt(year),
      yearlyStats: yearlyStats[0] || {
        totalSearches: 0,
        totalTokens: 0,
        totalEnergyUsage: 0,
        totalCarbonEmissions: 0,
        totalWaterUsage: 0,
      },
      dailyUsage: dailyUsageMap,
      specificDateUsage,
      searchDates: Object.keys(dailyUsageMap),
    };

    console.log("\n📊 FINAL API RESULT:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

testCalendarAPI();
