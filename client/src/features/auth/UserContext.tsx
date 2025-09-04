import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    country?: string;
  };
  isAdmin: boolean;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));
  const [isLoading, setIsLoading] = useState(true);

  // Set up axios interceptor for auth token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      // Check for token in localStorage (in case it was set by OAuth redirect)
      const storedToken = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (storedToken && storedToken !== token) {
        setToken(storedToken);
        return; // This will trigger another useEffect call
      }
      
      // Check for updated token in localStorage
      const storedToken = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (storedToken && storedToken !== token) {
        setToken(storedToken);
        return;
      }
      
      if (token) {
        try {
          const response = await axios.get('/api/users/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Check for OAuth success on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('token');
    
    if (oauthToken) {
      localStorage.setItem('userToken', oauthToken);
      setToken(oauthToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Check for OAuth success on page load
  useEffect(() => {
    const checkOAuthSuccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const oauthToken = urlParams.get('token');
      
      if (oauthToken) {
        localStorage.setItem('userToken', oauthToken);
        setToken(oauthToken);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    checkOAuthSuccess();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('userToken', newToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post('/api/users/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('userToken', newToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await axios.put('/api/users/profile', userData);
      setUser(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const value: UserContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;