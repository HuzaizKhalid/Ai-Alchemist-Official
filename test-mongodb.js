const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.log('📝 Please create a .env.local file with your MongoDB connection string');
    return;
  }

  const uri = process.env.MONGODB_URI;
  console.log('🔗 Connecting to:', uri.replace(/\/\/.*@/, '//***:***@'));

  const options = {
    tls: uri.includes('mongodb+srv') ? true : false,
    tlsAllowInvalidCertificates: !uri.includes('mongodb+srv'),
    tlsAllowInvalidHostnames: !uri.includes('mongodb+srv'),
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  };

  const client = new MongoClient(uri, options);

  try {
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    const db = client.db('AiAlchemist');
    await db.admin().ping();
    console.log('🏓 Database ping successful!');
    console.log('📊 Connected to database:', db.databaseName);
    
    // Get database stats
    try {
      const stats = await db.stats();
      console.log('📄 Collections:', stats.collections || 0);
      console.log('💾 Data size:', stats.dataSize || 0, 'bytes');
    } catch (err) {
      console.log('📊 Database stats not available (database might be empty)');
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('💡 Suggestions:');
      console.log('   - Make sure MongoDB is running locally on localhost:27017');
      console.log('   - Or update MONGODB_URI in .env.local with your MongoDB connection string');
      console.log('   - For MongoDB Atlas, ensure your IP is whitelisted');
    }
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

testConnection();
