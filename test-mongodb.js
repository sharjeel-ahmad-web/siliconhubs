// Quick MongoDB connection test
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'siliconhubs';

if (!uri) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function testConnection() {
  console.log('🔌 Testing MongoDB connection...');
  console.log(`URI: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
  console.log(`Database: ${dbName}\n`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    
    console.log(`\n📊 Database "${dbName}" contains ${collections.length} collection(s):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    if (collections.length === 0) {
      console.log('\n💡 Database is empty. The app will create collections automatically when needed.');
    }

    console.log('\n✅ MongoDB is ready to use!');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:');
    console.error(error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure MongoDB service is running');
    console.log('   2. Check if the connection string is correct');
    console.log('   3. For local MongoDB, use: mongodb://localhost:27017');
    process.exit(1);
  } finally {
    await client.close();
  }
}

testConnection();

