import { initializeApp } from "firebase/app";
import { getAuth,initializeAuth, getReactNativePersistance  } from 'firebase/auth';
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDpzMYLwbAd9TUu0I6uCqz-xgUVOhESDI",
  authDomain: "speedstrategist-d562d.firebaseapp.com",
  projectId: "speedstrategist-d562d",
  storageBucket: "speedstrategist-d562d.appspot.com",
  messagingSenderId: "259756989049",
  appId: "1:259756989049:web:ae657e1a6232d12f6a12a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app)
initializeApp(app, {
  persistance: getReactNativePersistance(ReactNativeAsyncStorage)
})

export { app, auth, getApp, getAuth }