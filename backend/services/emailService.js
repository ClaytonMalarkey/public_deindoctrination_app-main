const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Check if email is configured
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass || emailUser === 'your-email@gmail.com') {
    console.log('⚠️  Email not configured. Using development mode (console logging).');
    return null;
  }
  
  return nodemailer.createTransport({  // Fixed: createTransport not createTransporter
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Send email or log to console in development
const sendEmailOrLog = async (transporter, mailOptions, emailType) => {
  if (!transporter) {
    // Development mode - log to console
    console.log('\n' + '='.repeat(60));
    console.log(`📧 ${emailType.toUpperCase()} EMAIL (Development Mode)`);
    console.log('='.repeat(60));
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log('='.repeat(60));
    
    // Extract OTP from HTML content
    const otpMatch = mailOptions.html.match(/(\d{6})/);
    if (otpMatch) {
      console.log(`🔑 YOUR OTP CODE: ${otpMatch[1]}`);
      console.log('='.repeat(60));
      console.log('💡 Copy this OTP and use it in your frontend form');
    }
    console.log('='.repeat(60) + '\n');
    
    return { success: true, message: `${emailType} logged to console (development mode)` };
  }
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ ${emailType} email sent successfully`);
    return { success: true, message: `${emailType} sent successfully` };
  } catch (error) {
    console.error(`❌ Error sending ${emailType} email:`, error);
    return { success: false, error: error.message };
  }
};

// Send email verification OTP
const sendVerificationOTP = async (email, username, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@deindoctrination.com',
      to: email,
      subject: 'Email Verification - Deindoctrination App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Deindoctrination App!</h2>
          <p>Hi ${username},</p>
          <p>Thank you for registering with us. Please verify your email address using the OTP below:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      `
    };
    
    return await sendEmailOrLog(transporter, mailOptions, 'verification OTP');
    
  } catch (error) {
    console.error('❌ Error in sendVerificationOTP:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset OTP
const sendPasswordResetOTP = async (email, username, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@deindoctrination.com',
      to: email,
      subject: 'Password Reset - Deindoctrination App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi ${username},</p>
          <p>You requested to reset your password. Please use the OTP below to reset your password:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #dc3545; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          
          <p>This OTP will expire in 15 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset OTP sent to ${email}`);
    return { success: true, message: 'Password reset OTP sent successfully' };
    
  } catch (error) {
    console.error('❌ Error sending password reset OTP:', error);
    return { success: false, error: error.message };
  }
};

// Send login OTP
const sendLoginOTP = async (email, username, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@deindoctrination.com',
      to: email,
      subject: 'Login Verification - Deindoctrination App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Login Verification</h2>
          <p>Hi ${username},</p>
          <p>Someone is trying to log into your account. If this is you, please use the OTP below:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #28a745; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          
          <p>This OTP will expire in 5 minutes.</p>
          <p>If this wasn't you, please secure your account immediately.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      `
    };
    
    return await sendEmailOrLog(transporter, mailOptions, 'login OTP');
    
  } catch (error) {
    console.error('❌ Error in sendLoginOTP:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendVerificationOTP,
  sendPasswordResetOTP,
  sendLoginOTP
};