// Firebase authentication configuration
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Export default auth instance
export default auth;

// Helper function to check if email is from allowed domain
export const isAllowedDomain = (email: string): boolean => {
  const allowedDomains = ['kpritech.ac.in', 'kprit.edu.in'];
  return allowedDomains.some(domain => email.endsWith(`@${domain}`));
};

// Helper function to check if user is admin
export const isAdminUser = (email: string): boolean => {
  const adminEmails = [
    'admin@kpritech.ac.in',
    'placement@kpritech.ac.in',
    'tpo@kpritech.ac.in'
  ];
  return adminEmails.includes(email);
};
