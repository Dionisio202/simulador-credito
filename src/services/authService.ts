import { LoginRequest } from '../models/login/LoginRequest';
import { LoginResponse } from '../models/login/LoginResponse';
import { API_URL } from '../constants/api'; // 

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/users/login`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error de login');
  }

  const data: LoginResponse = await response.json();
  return data;
};
