const admin = require('firebase-admin');
const serviceAccount = require('./lienco-4bba9-firebase-adminsdk-687ew-c7c92ebef0.json'); // Update the path to your downloaded JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-database-name>.firebaseio.com" // Replace with your database URL
});

module.exports = admin;