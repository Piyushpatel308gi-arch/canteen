import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCz_nuQKlbNkUV6KWVhGL8RMId8do1_qBg",
  authDomain: "ceentenq.firebaseapp.com",
  projectId: "ceentenq",
  storageBucket: "ceentenq.firebasestorage.app",
  messagingSenderId: "729575151503",
  appId: "1:729575151503:web:ec94c3ff2b19cadef9ddfa",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

export const storage = getStorage(app);

export default app;