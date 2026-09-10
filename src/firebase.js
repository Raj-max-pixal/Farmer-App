import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

export function getFirebaseConfig() {
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('agridirect_firebase_api_key') : null;
  return {
    apiKey: customKey || import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB1eiK86rfwLfrsUVL6bjyBCV283dRaWqU",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agridirect-app-18f0b.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agridirect-app-18f0b",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agridirect-app-18f0b.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "946183974443",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:946183974443:web:40d1652d5947a4d11ec46e",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G5T9FHLK8N"
  };
}

export function initFirebaseApp() {
  const config = getFirebaseConfig();
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(config);
}

const app = initFirebaseApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email,
        photoUrl: user.photoURL,
        phone: user.phoneNumber || '+91 98421 10001'
      }
    };
  } catch (error) {
    console.warn('Firebase Google Sign-In error:', error.code, error.message);
    const isUnauthorizedDomain = error.code === 'auth/unauthorized-domain' || error.message?.includes('unauthorized-domain');
    const isConfigNotFound = error.code === 'auth/configuration-not-found' || error.message?.includes('configuration-not-found');
    const isInvalidKey = error.message?.includes('api-key-not-valid') || error.message?.includes('invalid-api-key') || error.code === 'auth/api-key-not-valid';

    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';

    let userFriendlyError = error.message;
    if (isUnauthorizedDomain) {
      userFriendlyError = `⚠️ Domain '${currentHost}' is not authorized in Firebase Console. Please add '${currentHost}' under Firebase Console > Authentication > Settings > Authorized domains.`;
    } else if (isConfigNotFound) {
      userFriendlyError = '⚠️ Google Sign-In is not enabled yet in your Firebase Console. Please go to Firebase Console > Authentication > Sign-in method and enable Google provider.';
    } else if (isInvalidKey) {
      userFriendlyError = '⚠️ Firebase API Key is invalid. Please check your key or use Email/Password Sign In.';
    }

    return {
      success: false,
      isUnauthorizedDomain,
      isConfigNotFound,
      isInvalidKey,
      error: userFriendlyError
    };
  }
}

export default app;
