
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type UserRole = 'renter' | 'landlord' | 'admin' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for users
const MOCK_USERS: Record<string, User> = {
  'renter@example.com': {
    id: '1',
    email: 'renter@example.com',
    name: 'Robert Renter',
    role: 'renter',
  },
  'landlord@example.com': {
    id: '2',
    email: 'landlord@example.com',
    name: 'Lucy Landlord',
    role: 'landlord',
  },
  'admin@example.com': {
    id: '3',
    email: 'admin@example.com',
    name: 'Adam Admin',
    role: 'admin',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in our mock data and matches the role
      const mockUser = MOCK_USERS[email.toLowerCase()];
      
      if (mockUser && mockUser.role === role && password === 'password') {
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast.success(`Welcome back, ${mockUser.name}!`);
      } else {
        throw new Error('Invalid credentials or role');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS[email.toLowerCase()]) {
        throw new Error('Email already in use');
      }
      
      // Create new user (in a real app, this would be a backend API call)
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 11),
        email: email.toLowerCase(),
        name,
        role,
      };
      
      // Add to our mock database
      MOCK_USERS[email.toLowerCase()] = newUser;
      
      // Log them in
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
