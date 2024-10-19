// src/auth.js
import { doc, setDoc,getDoc } from 'firebase/firestore';
import { auth,db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getAuth } from 'firebase/auth';


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
// export const register = async (email, password) => {
//   return await createUserWithEmailAndPassword(auth, email, password);
// };
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
    const role = await fetchUserRole(user.uid);
    return { user, role };
  } catch (error) {
    console.error('Login error:', error.message);
    throw new Error(error.message);
  }
};

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

export default auth