import { initializeApp } from "firebase/app";
import { getMessaging, setBackgroundMessageHandler } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: self.API_KEY,
  authDomain: self.AUTH_DOMAIN,
  databaseURL: self.DATABASE_URL,
  projectId: self.PROJECT_ID,
  storageBucket: self.STORAGE_BUCKET,
  messagingSenderId: self.MESSAGING_SENDER_ID,
  appId: self.APP_ID,
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

setBackgroundMessageHandler((payload) => {
  console.log('Background message received. ', payload);
  // Handle the background notification if needed
});