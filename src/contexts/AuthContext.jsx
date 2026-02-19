import { createContext, useContext, useState, useCallback } from 'react';
import authService from '@/services/authService';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password, role);

      if (response.status === 'success') {
        const userData = {
          id: response.data.user.id || response.data.user._id,
          email: response.data.user.email,
          name: response.data.user.name,
          avatar: response.data.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.data.user.email}`,
          role: response.data.user.role,
          roles: response.data.user.roles || [response.data.user.role],
          permissions: response.data.user.permissions || [],
          isAdmin: response.data.isAdmin || false,
          phone: response.data.user.phone,
          status: response.data.user.status,
          branchId: response.data.user.branchId,
        };

        // Token is already stored in authService.login
        // Just store user data here
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        return userData;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to let the Login component handle the error
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Remove both user data and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setError(null);
  }, []);

  const switchRole = useCallback((role) => {
    if (user && user.roles?.includes(role)) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const updateUser = useCallback((updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const value = {
    user,
    isAuthenticated: user !== null,
    loading,
    error,
    login,
    logout,
    switchRole,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}