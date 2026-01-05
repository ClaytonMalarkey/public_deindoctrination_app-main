const fs = require('fs');
const path = require('path');

console.log('\n🔧 Gmail Email Configuration for Production Mode');
console.log('='.repeat(50));
console.log('\n📧 To send real emails, you need to set up Gmail App Password:');
console.log('\n1. Go to your Google Account settings');
console.log('2. Enable 2-Factor Authentication');
console.log('3. Go to Security > App passwords');
console.log('4. Generate an App Password for "Mail"');
console.log('5. Copy the 16-digit password (not your regular password)');
console.log('\n⚠️  IMPORTANT: Use App Password, NOT your regular Gmail password!');
console.log('\n📝 Edit the .env file with your credentials:');

const envPath = path.join(__dirname, '.env');
console.log(`\nFile location: ${envPath}`);
console.log('\nReplace these lines in .env:');
console.log('EMAIL_USER=your-email@gmail.com');
console.log('EMAIL_PASS=your-16-digit-app-password');
console.log('\nWith your actual Gmail and app password.');
console.log('\n🔄 After editing, restart the server: npm run dev');
console.log('\n✅ Then emails will be sent immediately to users!');
console.log('\n' + '='.repeat(50));

// Check if .env exists
if (fs.existsSync(envPath)) {
  console.log('\n✅ .env file exists and ready for editing');
} else {
  console.log('\n❌ .env file not found. Creating template...');
  
  const envTemplate = `PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/deindoctrinationApp
JWT_SECRET=deindoctrination_jwt_secret_2024_secure_key
JWT_REFRESH_SECRET=deindoctrination_refresh_secret_2024_secure_key
NODE_ENV=development

# Email Configuration - REPLACE WITH YOUR ACTUAL GMAIL CREDENTIALS
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password

# OTP Configuration
OTP_EXPIRY_MINUTES=10
PASSWORD_RESET_OTP_EXPIRY_MINUTES=15
LOGIN_OTP_EXPIRY_MINUTES=5`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env template created');
}