import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/auth/',
});

// Function to store token in AsyncStorage
const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

interface UserCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
  };
}

// Login Mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, UserCredentials>(
    async (credentials) => {
      const response = await api.post('/login/user', credentials);
      return response.data;
    },
    {
      onSuccess: async (data) => {
        await storeToken(data.token);
        queryClient.invalidateQueries(['user']);
        console.log('Login successful, token stored.');
      },
    }
  );
};

// Types for register
interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

// Register Mutation
export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, Error, RegisterCredentials>(
    async (credentials) => {
      const response = await api.post('/register', credentials);
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log('Registration successful:', data.message);
      },
    }
  );
};

// Logout Mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>(
    async () => {
      await api.post('/logout');
      await removeToken();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
        console.log('Logout successful, token removed.');
      },
    }
  );
};

