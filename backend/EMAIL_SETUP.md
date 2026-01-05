# Email Configuration Setup

To enable email functionality for OTP verification, you need to configure email settings.

## Gmail Setup (Recommended)

1. **Create a Gmail App Password:**
   - Go to your Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password for "Mail"

2. **Create `.env` file in backend folder:**
   ```
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/deindoctrinationApp
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_REFRESH_SECRET=your_secure_refresh_secret_here
   NODE_ENV=development

   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password

   # OTP Configuration
   OTP_EXPIRY_MINUTES=10
   PASSWORD_RESET_OTP_EXPIRY_MINUTES=15
   LOGIN_OTP_EXPIRY_MINUTES=5
   ```

3. **Replace with your actual credentials:**
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your 16-digit app password (not your regular password)

## Alternative Email Providers

You can also use other email providers by modifying the transporter in `services/emailService.js`:

### Outlook/Hotmail
```javascript
service: 'hotmail'
```

### Yahoo
```javascript
service: 'yahoo'
```

### Custom SMTP
```javascript
host: 'smtp.yourdomain.com',
port: 587,
secure: false,
```

## Testing Email Functionality

1. Set up your email credentials in `.env`
2. Restart the backend server
3. Try registering a new user
4. Check your email for the OTP

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique passwords
- Enable 2FA on your email account
- Use app-specific passwords instead of your main password