// Test environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables:\n');

const required = [
  'MONGODB_URI',
  'MONGODB_DB',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_SITE_URL',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD'
];

let allGood = true;

required.forEach(key => {
  const value = process.env[key];
  if (!value) {
    console.log(`❌ ${key}: MISSING`);
    allGood = false;
  } else {
    // Hide sensitive values
    if (key.includes('SECRET') || key.includes('PASSWORD') || key.includes('KEY')) {
      console.log(`✅ ${key}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`✅ ${key}: ${value}`);
    }
  }
});

console.log('\n');

if (allGood) {
  console.log('✅ All required environment variables are set!');
  
  // Check NEXTAUTH_SECRET length
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret && secret.length < 32) {
    console.log('⚠️  WARNING: NEXTAUTH_SECRET should be at least 32 characters long');
  }
} else {
  console.log('❌ Some environment variables are missing!');
  console.log('💡 Make sure .env.local file exists and contains all required variables');
  process.exit(1);
}

