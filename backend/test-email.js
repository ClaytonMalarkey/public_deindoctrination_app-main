const { sendVerificationOTP } = require('./services/emailService');
require('dotenv').config();

const testEmail = async () => {
  console.log('\n🧪 Testing Email Configuration...');
  console.log('='.repeat(40));
  
  // Check if email is configured
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass || emailUser === 'your-email@gmail.com') {
    console.log('❌ Email not configured yet.');
    console.log('📝 Please edit .env file with your Gmail credentials.');
    console.log('🔧 Run: npm run setup-email for instructions');
    return;
  }
  
  console.log(`📧 Email User: ${emailUser}`);
  console.log(`🔑 Password: ${'*'.repeat(emailPass.length)} (hidden)`);
  
  // Test email
  const testEmailAddress = process.argv[2] || emailUser;
  console.log(`\n📤 Sending test OTP to: ${testEmailAddress}`);
  
  try {
    const result = await sendVerificationOTP(testEmailAddress, 'Test User', '123456');
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Check your inbox for the test OTP email.');
      console.log('🎉 Email configuration is working correctly!');
    } else {
      console.log('❌ Email failed to send:', result.error);
      console.log('💡 Check your Gmail credentials and app password.');
    }
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
    console.log('💡 Make sure you are using Gmail App Password, not regular password.');
  }
  
  console.log('\n' + '='.repeat(40));
};

testEmail();