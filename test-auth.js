const fetch = require("node-fetch");
require("dotenv").config({ path: ".env.local" });

const baseUrl = "http://localhost:3001";

async function testAuthFlow() {
  console.log("🧪 Testing Authentication Flow...\n");

  try {
    // Test 1: Check initial auth status (should be 401)
    console.log("1️⃣ Testing /api/auth/me (should return 401)...");
    const meResponse = await fetch(`${baseUrl}/api/auth/me`);
    console.log(`   Status: ${meResponse.status} ${meResponse.statusText}`);

    if (meResponse.status === 401) {
      console.log("   ✅ Not authenticated (expected)\n");
    } else {
      console.log("   ❌ Unexpected status\n");
    }

    // Test 2: Sign up a new user
    console.log("2️⃣ Testing user signup...");
    const signupData = {
      email: "testuser@example.com",
      password: "TestPassword123",
      name: "Test User",
    };

    const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });

    console.log(
      `   Status: ${signupResponse.status} ${signupResponse.statusText}`
    );
    const signupResult = await signupResponse.json();
    console.log("   Response:", JSON.stringify(signupResult, null, 2));

    if (signupResponse.ok) {
      console.log("   ✅ Signup successful\n");

      // Test 3: Sign in with the new user
      console.log("3️⃣ Testing user signin...");
      const signinData = {
        email: signupData.email,
        password: signupData.password,
      };

      const signinResponse = await fetch(`${baseUrl}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinData),
      });

      console.log(
        `   Status: ${signinResponse.status} ${signinResponse.statusText}`
      );
      const signinResult = await signinResponse.json();
      console.log("   Response:", JSON.stringify(signinResult, null, 2));

      if (signinResponse.ok) {
        console.log("   ✅ Signin successful\n");

        // Extract auth cookie for further requests
        const cookies = signinResponse.headers.get("set-cookie");
        console.log("   Auth Cookie:", cookies);
      } else {
        console.log("   ❌ Signin failed\n");
      }
    } else {
      console.log("   ❌ Signup failed\n");

      // If signup failed due to existing user, try signin
      if (signupResult.error && signupResult.error.includes("already exists")) {
        console.log("3️⃣ User exists, testing signin...");
        const signinResponse = await fetch(`${baseUrl}/api/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: signupData.email,
            password: signupData.password,
          }),
        });

        console.log(
          `   Status: ${signinResponse.status} ${signinResponse.statusText}`
        );
        const signinResult = await signinResponse.json();
        console.log("   Response:", JSON.stringify(signinResult, null, 2));
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testAuthFlow();
