import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password, displayName, role = 'customer') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore with role
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        email,
        role,
        createdAt: new Date(),
        isActive: true,
        lastLogin: new Date()
      });
      
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: new Date()
      }, { merge: true });
      
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const getUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data().role : 'customer';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'customer';
    }
  };

  const updateUserRole = async (uid, newRole) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        role: newRole,
        updatedAt: new Date()
      }, { merge: true });
      
      // Update local user state if it's the current user
      if (user && user.uid === uid) {
        setUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setUser({ 
            ...firebaseUser, 
            role: userData.role || 'customer',
            ...userData
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Set user with default role if Firestore fetch fails
          setUser({ 
            ...firebaseUser, 
            role: 'customer'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    register,
    login,
    logout,
    loading,
    updateUserRole,
    getAllUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};