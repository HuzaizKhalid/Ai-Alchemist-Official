#!/usr/bin/env node

console.log('🧹 Database Migration Helper\n');

console.log('To completely switch to the new database and clear old sessions:');
console.log('');
console.log('1️⃣ BROWSER CLEANUP:');
console.log('   - Open Developer Tools (F12)');
console.log('   - Go to Application/Storage tab');
console.log('   - Clear all cookies for localhost:3001');
console.log('   - Clear localStorage and sessionStorage');
console.log('   - Or use Incognito/Private browsing mode');
console.log('');
console.log('2️⃣ SERVER CLEANUP:');
console.log('   - Stop the development server');
console.log('   - Clear any cached connections');
console.log('   - Restart with: npm run dev');
console.log('');
console.log('3️⃣ MONGODB ATLAS SETUP (for new cluster):');
console.log('   - Login to MongoDB Atlas');
console.log('   - Go to Network Access → Add your IP');
console.log('   - Go to Database Access → Verify user credentials');
console.log('   - Ensure cluster is running and accessible');
console.log('');
console.log('4️⃣ TEST CONNECTION:');
console.log('   - Run: npm run test-db');
console.log('   - Should show successful connection');
console.log('');
console.log('Current Status:');
console.log('   ✅ Old DB: mongodb+srv://...@cluster0.kbjqt51.mongodb.net (3 users)');
console.log('   ❌ New DB: mongodb+srv://...@cluster0.zurpwjp.mongodb.net (connection failed)');
console.log('');
console.log('💡 Recommendation: Fix the new cluster connection first!');
