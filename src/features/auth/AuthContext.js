'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ctg_admin_user';

/**
 * Generate a mock user object based on credentials.
 * TODO: Replace this with a real API call to POST /api/auth/login
 * that returns a JWT token and user object.
 */
function createMockUser(email, role) {
  const namePart = email.split('@')[0];
  const name = namePart
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: `mock-${Date.now()}`,
    name,
    email,
    role,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Corrupted storage — ignore
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login function.
   * Currently simulates authentication with mock data.
   * TODO: Replace with real API call:
   *   const res = await apiFetch('/api/auth/login', {
   *     method: 'POST',
   *     body: JSON.stringify({ email, password, role }),
   *   });
   *   localStorage.setItem('ctg_admin_token', res.token);
   *   setUser(res.user);
   */
  async function login(email, password, role) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    if (!role) {
      throw new Error('Please select a role.');
    }

    // Simulate a brief network delay
    await new Promise((r) => setTimeout(r, 400));

    const mockUser = createMockUser(email, role);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  }

  /**
   * Logout function. Clears all stored auth data.
   */
  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('ctg_admin_token');
    localStorage.removeItem('ctg_admin_key');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
