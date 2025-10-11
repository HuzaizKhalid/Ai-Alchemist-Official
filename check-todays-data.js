const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkTodaysData() {
  console.log('🔍 Checking today\'s data in each collection...');
  
  if (!MONGODB_URI) {
    console.log('❌ MongoDB URI not found');
    return;
  }

  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db("AiAlchemist");
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log(`📅 Checking data from ${today.toISOString()} to ${tomorrow.toISOString()}`);
    
    const collections = ['histories', 'searches', 'shared_searches'];
    
    for (const collectionName of collections) {
      console.log(`\n📂 Checking ${collectionName}:`);
      
      const collection = db.collection(collectionName);
      
      // Count today's documents
      const todayCount = await collection.countDocuments({
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      });
      
      console.log(`  📊 Documents today: ${todayCount}`);
      
      // Get a few sample documents from today
      if (todayCount > 0) {
        const samples = await collection.find({
          createdAt: {
            $gte: today,
            $lt: tomorrow
          }
        }).limit(3).toArray();
        
        samples.forEach((doc, index) => {
          console.log(`  📄 Sample ${index + 1}:`, {
            id: doc._id,
            query: doc.query?.substring(0, 50) + '...',
            createdAt: doc.createdAt,
            userId: doc.userId
          });
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

checkTodaysData();