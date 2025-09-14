// Check current search usage
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkSearchUsage() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('AiAlchemist');
    const users = db.collection('users');
    
    // Get all users and their search usage
    const usersData = await users.find({}, {
      projection: {
        email: 1,
        name: 1,
        plan: 1,
        searchesUsed: 1,
        searchesResetDate: 1
      }
    }).toArray();
    
    console.log('📊 Current Search Usage:');
    console.log('========================');
    
    usersData.forEach(user => {
      const resetDate = new Date(user.searchesResetDate);
      const today = new Date();
      const isToday = today.toDateString() === resetDate.toDateString();
      const dailyLimit = user.plan === 'pro' ? '∞' : '3';
      
      console.log(`👤 ${user.name || 'Unknown'} (${user.email})`);
      console.log(`   Plan: ${user.plan}`);
      console.log(`   Usage: ${user.searchesUsed}/${dailyLimit} searches`);
      console.log(`   Reset Date: ${resetDate.toDateString()} ${isToday ? '(TODAY)' : '(OLD)'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkSearchUsage();