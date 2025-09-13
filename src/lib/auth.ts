// Firebase configuration and authentication utilities
// Note: This is a mock implementation until Firebase package is properly installed
"use client";

import React from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

interface AuthResult {
  user: User | null;
  error?: string;
}

class MockFirebaseAuth {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  // Mock authentication methods
  async signInWithEmailAndPassword(email: string, password: string): Promise<AuthResult> {
    // Validate college email domain
    const allowedDomain = 'kprit.edu.in';
    if (!email.endsWith(`@${allowedDomain}`)) {
      return {
        user: null,
        error: `Only ${allowedDomain} email addresses are allowed`
      };
    }

    // Mock successful login
    const user: User = {
      uid: `mock_${Date.now()}`,
      email: email,
      displayName: email.split('@')[0],
      emailVerified: true
    };

    this.currentUser = user;
    this.notifyListeners();

    return { user };
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<AuthResult> {
    // Validate college email domain
    const allowedDomain = 'kprit.edu.in';
    if (!email.endsWith(`@${allowedDomain}`)) {
      return {
        user: null,
        error: `Only ${allowedDomain} email addresses are allowed`
      };
    }

    // Validate password strength
    if (password.length < 6) {
      return {
        user: null,
        error: 'Password must be at least 6 characters long'
      };
    }

    // Mock successful registration
    const user: User = {
      uid: `mock_${Date.now()}`,
      email: email,
      displayName: email.split('@')[0],
      emailVerified: false
    };

    this.currentUser = user;
    this.notifyListeners();

    return { user };
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners();
  }

  async sendEmailVerification(): Promise<void> {
    console.log('Email verification sent (mock)');
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    console.log('Password reset email sent (mock):', email);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current user
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  // Check if user has admin privileges
  async isAdmin(email: string): Promise<boolean> {
    // Mock admin check - in real implementation, this would check against database
    const adminEmails = ['admin@kprit.edu.in', 'placement@kprit.edu.in'];
    return adminEmails.includes(email);
  }
}

// Export singleton instance
export const auth = new MockFirebaseAuth();

// Hook for using authentication in React components
export function useAuth() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}

// Authentication context provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    signIn: auth.signInWithEmailAndPassword.bind(auth),
    signUp: auth.createUserWithEmailAndPassword.bind(auth),
    signOut: auth.signOut.bind(auth),
    sendEmailVerification: auth.sendEmailVerification.bind(auth),
    sendPasswordReset: auth.sendPasswordResetEmail.bind(auth),
    isAdmin: auth.isAdmin.bind(auth)
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

// Authentication context
const AuthContext = React.createContext<any>(null);

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}