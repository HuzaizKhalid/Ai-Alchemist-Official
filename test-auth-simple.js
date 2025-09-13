const https = require("https");
const http = require("http");

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const protocol = options.port === 443 ? https : http;
    const req = protocol.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testAuth() {
  console.log("🧪 Testing Authentication Endpoints...\n");

  const baseOptions = {
    hostname: "localhost",
    port: 3001,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    // Test 1: Check auth status
    console.log("1️⃣ Testing GET /api/auth/me");
    const authCheck = await makeRequest({
      ...baseOptions,
      path: "/api/auth/me",
      method: "GET",
    });
    console.log(`Status: ${authCheck.statusCode}`);
    console.log(`Response: ${authCheck.body}\n`);

    // Test 2: Test signup
    console.log("2️⃣ Testing POST /api/auth/signup");
    const signupData = JSON.stringify({
      email: "test2@example.com",
      password: "TestPassword123",
      name: "Test User 2",
    });

    const signup = await makeRequest(
      {
        ...baseOptions,
        path: "/api/auth/signup",
        method: "POST",
      },
      signupData
    );

    console.log(`Status: ${signup.statusCode}`);
    console.log(`Response: ${signup.body}`);

    if (signup.headers["set-cookie"]) {
      console.log(`Auth Cookie: ${signup.headers["set-cookie"]}`);
    }
    console.log("");

    // Test 3: Test signin
    console.log("3️⃣ Testing POST /api/auth/signin");
    const signinData = JSON.stringify({
      email: "test2@example.com",
      password: "TestPassword123",
    });

    const signin = await makeRequest(
      {
        ...baseOptions,
        path: "/api/auth/signin",
        method: "POST",
      },
      signinData
    );

    console.log(`Status: ${signin.statusCode}`);
    console.log(`Response: ${signin.body}`);

    if (signin.headers["set-cookie"]) {
      console.log(`Auth Cookie: ${signin.headers["set-cookie"]}`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAuth();
