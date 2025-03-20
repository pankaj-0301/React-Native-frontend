import axios from 'axios';
import supabase from './supabase';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.102:5000',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get the current session
const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Function to refresh the session if needed
const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
};

// utils/apiClient.js
apiClient.interceptors.request.use(async (config) => {
  try {
    let session = await getCurrentSession();
    
    // Add cache-busting parameter
    const separator = config.url.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}_t=${new Date().getTime()}`;
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return config;
  }
});


// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the session
        const session = await refreshSession();
        
        if (session?.access_token) {
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }

    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error - please check your connection');
      console.error('Error details:', error.message);
      console.error('Request URL:', originalRequest.url);
      console.error('Request headers:', originalRequest.headers);
    } else if (error.response.status === 401) {
      console.error('Authentication error - please sign in again');
    }
    return Promise.reject(error);
  }
);

// Function to fetch transactions with userId
export const fetchTransactions = async (userId) => {
  try {
    console.log("Fetching transactions for user:", userId);
    const response = await apiClient.get(`/api/transactions?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Example usage:
// const transactions = await fetchTransactions('346d25bd-7b06-4817-859d-a0d35ecc4f04');

export default apiClient;
