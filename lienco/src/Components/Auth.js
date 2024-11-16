// src/auth.js
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

export const fetchUserRole = async (uid) => {
  try {
    const userDocRef = doc(db, 'Roles', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().Role; // Ensure this matches your Firestore field
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

const addUserToFirestore = async (uid, email, role) => {
  console.log('Attempting to add user to Firestore:', { uid, email, role });
  try {
    const userDocRef = doc(db, 'Roles', uid); // Correctly refer to the collection and document
    await setDoc(userDocRef, { 
      Email: email, 
      Role: role 
    });
    console.log('User successfully added to Firestore');
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};

// Sign Up Function
export const register = async (email, password) => {
  console.log('Register function called'); // This should log when the function is entered
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await addUserToFirestore(user.uid, email, 'user');
    console.log('User successfully registered and added to Firestore!');
  } catch (error) {
    console.error('Registration error:', error.message); // Log any errors
    throw new Error(error.message);
  }
};

// Sign In Function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ensure to check the role from Firestore
    const role = await fetchUserRole(user.uid);
    if (!role) {
      throw new Error('User role not found in Firestore.');
    }

    return { user, role };
  } catch (error) {
    console.error('Login error:', error.message);
    throw new Error(error.message);
  }
};

// Set persistence for authentication
const authPersistence = async () => {
  const auth = getAuth();
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log('Auth persistence set to local storage.');
  } catch (error) {
    console.error('Error setting persistence:', error);
  }
};

authPersistence(); // Call the persistence function

export const resetPassword = async (email) => {
  const auth = getAuth();
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      // Email sent.
      console.log("Password reset email sent!");
    })
    .catch((error) => {
      // An error occurred.
      throw new Error(error.message);
    });
}

// Function to create a notification
export const createNotification = async (notificationData) => {
  try {
    const notificationsCollection = collection(db, 'notifications');
    await addDoc(notificationsCollection, notificationData);
    console.log('Notification created successfully');
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export default auth;
