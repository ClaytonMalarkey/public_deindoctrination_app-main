const admin = require("firebase-admin");

// Firebase service account credentials (Replace with actual credentials)
const serviceAccount = require("../config/firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (token, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    await admin.messaging().send(message);
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { sendNotification };
