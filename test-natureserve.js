// Test NatureServe API Integration
// Run with: node test-natureserve.js

require("dotenv").config({ path: ".env.local" });

const API_KEY = process.env.NATURESERVE_API_KEY;

console.log("🌍 NatureServe API Integration Test\n");
console.log("=".repeat(50));

if (!API_KEY) {
  console.log("ℹ️  No NATURESERVE_API_KEY found in .env.local");
  console.log(
    "\n✅ This is NORMAL - the API is PUBLIC and works without a key!"
  );
  console.log("📚 API Docs: https://explorer.natureserve.org/api-docs/\n");
} else {
  console.log(
    "✅ API Key found:",
    API_KEY.substring(0, 10) + "..." + API_KEY.substring(API_KEY.length - 4)
  );
  console.log("ℹ️  Note: Key is optional for basic access\n");
}

console.log("🔍 Testing PUBLIC API connection (no key required)...\n");

const testSpecies = [
  { uid: "ELEMENT_GLOBAL.2.105212", name: "Polar Bear" },
  { uid: "ELEMENT_GLOBAL.2.100925", name: "American Pika" },
];

async function testAPI() {
  for (const species of testSpecies) {
    try {
      console.log(`\n📡 Fetching: ${species.name} (${species.uid})`);

      // Build headers - API key is optional
      const headers = { Accept: "application/json" };
      if (API_KEY) {
        headers["X-API-Key"] = API_KEY;
        console.log("   Using API key for request");
      } else {
        console.log("   Using public API (no key)");
      }

      const response = await fetch(
        `https://explorer.natureserve.org/api/data/taxon/${species.uid}`,
        { headers }
      );

      console.log(`   Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log("   ✅ Success!");
        console.log(`   Scientific Name: ${data.scientificName || "N/A"}`);
        console.log(`   Common Name: ${data.primaryCommonName || "N/A"}`);
        console.log(`   Status: ${data.roundedGlobalStatus || "N/A"}`);
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Failed: ${errorText.substring(0, 100)}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("\n💡 Summary:");
  console.log("✅ NatureServe API is PUBLIC - no key required!");
  console.log("✅ If tests pass: Integration works perfectly!");
  console.log("✅ If tests fail: Check network connection or API status");
  console.log("\n🎯 Next Steps:");
  console.log("1. Run: npm run dev");
  console.log('2. Click "Show Another Species" in your app');
  console.log(
    '3. Look for "Live Data" badge to confirm NatureServe connection'
  );
  console.log(
    "\n📚 API Documentation: https://explorer.natureserve.org/api-docs/"
  );
  console.log("📖 See NATURESERVE_API_SETUP.md for more details\n");
}

// Test local API endpoint
async function testLocalEndpoint() {
  try {
    console.log("\n🔍 Testing local API endpoint...");
    console.log("   (Make sure your dev server is running on port 3000)");

    const response = await fetch(
      "http://localhost:3000/api/endangered-animals"
    );

    if (response.ok) {
      const data = await response.json();
      console.log("   ✅ Local endpoint working!");
      console.log(`   Species: ${data.name}`);
      console.log(`   Source: ${data.source || "Fallback Data"}`);
    } else {
      console.log("   ⚠️  Dev server might not be running");
      console.log("   Start it with: npm run dev");
    }
  } catch (error) {
    console.log("   ℹ️  Could not connect to local server");
    console.log("   This is normal if dev server is not running");
  }
}

// Run tests
testAPI().then(() => testLocalEndpoint());
