import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'REFRESH_TOKEN':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptors
  useEffect(() => {
    // Request interceptor to add auth token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (state.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await axios.post('/api/auth/refresh-token', {
              refreshToken: state.refreshToken,
            });

            const { accessToken, refreshToken } = response.data;
            
            dispatch({
              type: 'REFRESH_TOKEN',
              payload: { accessToken, refreshToken },
            });

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh token failed, logout user
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [state.accessToken, state.refreshToken]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (state.accessToken) {
        try {
          const response = await axios.get('/api/auth/profile', {
            params: { email: state.user?.email }
          });
          dispatch({
            type: 'UPDATE_USER',
            payload: response.data,
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, user, message } = response.data;

      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, accessToken, refreshToken },
        });

        toast.success(message || 'Login successful!');
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.post('/api/auth/register', userData);
      
      const { message } = response.data;
      toast.success(message || 'Registration successful! Please check your email to verify your account.');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData,
    });
  };

  const verifyEmail = async (token) => {
    try {
      const response = await axios.post('/api/auth/verify-email', null, {
        params: { token },
      });
      
      const { message } = response.data;
      toast.success(message || 'Email verified successfully!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      const response = await axios.post('/api/auth/resend-verification', null, {
        params: { email },
      });
      
      const { message } = response.data;
      toast.success(message || 'Verification email sent successfully!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend verification email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', null, {
        params: { email },
      });
      
      const { message } = response.data;
      toast.success(message || 'Password reset email sent successfully!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send password reset email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post('/api/auth/reset-password', null, {
        params: { token, newPassword },
      });
      
      const { message } = response.data;
      toast.success(message || 'Password reset successfully!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const generateOtp = async (email) => {
    try {
      const response = await axios.post('/api/auth/generate-otp', null, {
        params: { email },
      });
      
      const { message, otp } = response.data;
      toast.success(message || 'OTP sent successfully!');
      
      return { success: true, otp };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate OTP';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.post('/api/auth/verify-otp', null, {
        params: { email, otp },
      });

      const { accessToken, refreshToken, user, message } = response.data;

      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, accessToken, refreshToken },
        });

        toast.success(message || 'OTP verification successful!');
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    generateOtp,
    verifyOtp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 