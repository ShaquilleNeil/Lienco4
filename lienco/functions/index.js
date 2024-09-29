// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: "soninc@gmail.com", // Your email
    pass: "R0negg1e@12", // Your email password (or an App password)
  },
});

// Trigger when a document is created in the contactForms collection
// eslint-disable-next-line max-len
exports.sendContactFormEmail = onDocumentWritten("contactForms/{documentId}", (change) => {
  const data = change.after.data();

  const mailOptions = {
    from: "your-email@gmail.com",
    to: "soninc@gmail.com", // Replace with your email
    subject: `New contact form submission from ${data.name}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Message: ${data.message}`,
    ].join("\n"), // Join the array into a single string with newlines
  };

  return transporter.sendMail(mailOptions)
      .then(() => console.log("Email sent!"))
  // eslint-disable-next-line max-len
      .catch((error) => console.error("There was an error while sending the email:", error));
});

// Example Hello World function (commented out)
// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
