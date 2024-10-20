// userManagement.js
const admin = require('./firebaseAdmin'); // Import the initialized Firebase Admin SDK

const createUser = async (email, password, role) => {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false,
    });
    
    // Here, you can assign the role to the user in your database
    // For example, if you're using Firestore:
    await admin.firestore().collection('Roles').doc(userRecord.uid).set({
      Email: email,
      Role: role,
    });

    console.log('Successfully created new user:', userRecord.uid);
  } catch (error) {
    console.error('Error creating new user:', error);
  }
};

createUser('user@example.com', 'password123', 'admin'); // Call the function with appropriate parameters

const updateUserRole = async (uid, newRole) => {
    try {
      // Update the role in the Firestore collection
      await admin.firestore().collection('Roles').doc(uid).update({
        Role: newRole,
      });
  
      console.log(`Successfully updated role for user: ${uid}`);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };