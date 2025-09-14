// Reset search count for testing purposes
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function resetSearchCount() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('AiAlchemist');
    const users = db.collection('users');
    
    // Get current user (you can modify the email to match yours)
    const userEmail = 'your-email@example.com'; // Replace with your actual email
    
    const result = await users.updateOne(
      { email: userEmail },
      {
        $set: {
          searchesUsed: 0,
          searchesResetDate: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount > 0) {
      console.log('✅ Search count reset successfully!');
      console.log(`Modified ${result.modifiedCount} user record(s)`);
      
      // Show current status
      const user = await users.findOne({ email: userEmail });
      console.log(`Current status: ${user.searchesUsed}/3 searches used today`);
    } else {
      console.log('❌ No user found with that email');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

resetSearchCount();