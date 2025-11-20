// src/services/userService.ts
import axios from "axios";
import type { CreateUserDTO, User, LoginDTO, TokenResponse } from "../models/User";
import { config } from "../config";

const API_URL = `${config.API_BASE_URL}/users`;

export const createUser = async (data: CreateUserDTO): Promise<User> => {
  const res = await axios.post<User>(API_URL, data);
  return res.data;
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const res = await axios.get<User>(`${API_URL}/${email}`);
  return res.data;
};

export const loginUser = async (data: LoginDTO): Promise<TokenResponse> => {
  const res = await axios.post<TokenResponse>(`${API_URL}/login`, data);
  return res.data;
};

export const refreshToken = async (token: string): Promise<TokenResponse> => {
  const res = await axios.post<TokenResponse>(`${API_URL}/refresh-token`, { refreshToken: token });
  return res.data;
};

export const logoutUser = async (token: string): Promise<{ message: string }> => {
  const res = await axios.post<{ message: string }>(`${API_URL}/logout`, { refreshToken: token });
  return res.data;
};
