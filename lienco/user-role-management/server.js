const admin = require('firebase-admin');
const express = require('express');
const app = express();

// Load your service account key JSON file
const serviceAccount = require('./lienco-4bba9-firebase-adminsdk-687ew-c7c92ebef0.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello, Firebase Admin SDK is running!');
});

// Start your server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
