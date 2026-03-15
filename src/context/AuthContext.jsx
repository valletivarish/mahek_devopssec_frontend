import { createContext, useContext, useState, useEffect } from 'react';

// Context for managing JWT authentication state across the application
const AuthContext = createContext(null);

/**
 * AuthProvider wraps the application and provides authentication state
 * (user info, token, login/logout functions) to all child components.
 * Persists the auth state in localStorage so users stay logged in across refreshes.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore auth state from localStorage if available
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Store auth data in state and localStorage after successful login
  const login = (authData) => {
    setToken(authData.token);
    setUser({
      id: authData.id,
      username: authData.username,
      email: authData.email,
      role: authData.role,
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify({
      id: authData.id,
      username: authData.username,
      email: authData.email,
      role: authData.role,
    }));
  };

  // Clear auth data from state and localStorage on logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Check if the user is currently authenticated
  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
