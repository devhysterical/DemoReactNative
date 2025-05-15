import auth from '@react-native-firebase/auth';
import {createUserProfileDocument} from './firestoreService';

export const signUp = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  const userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );
  const user = userCredential.user;
  await createUserProfileDocument(user, {email});
  await auth().signOut();
  return user;
};

export const signIn = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  return auth().signInWithEmailAndPassword(email, password);
};

export const signOut = async () => {
  return auth().signOut();
};

export const sendPasswordResetEmail = async email => {
  if (!email) {
    throw new Error('Email is required.');
  }
  return auth().sendPasswordResetEmail(email);
};

export const getCurrentUser = () => {
  return auth().currentUser;
};
