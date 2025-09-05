#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🔍 Alchemist AI - Health Check');
console.log('================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const fs = require('fs');

if (fs.existsSync(envPath)) {
  console.log('✅ Environment file (.env.local) found');
} else {
  console.log('❌ Environment file (.env.local) not found');
  console.log('📝 Please create .env.local with your MongoDB URI and other credentials');
  process.exit(1);
}

// Test MongoDB connection
console.log('🔍 Testing MongoDB connection...');
exec('node test-mongodb.js', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ MongoDB connection test failed');
    console.error(stderr);
    return;
  }
  
  console.log(stdout);
  console.log('🎉 All systems operational!');
  console.log('\n💡 Run "npm run dev" to start the development server');
});
