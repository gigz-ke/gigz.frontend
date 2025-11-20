export interface User {
  _id?: string;
  username: string;
  email: string;
  country: string;
  img?: string;
  phone?: string;
  desc?: string;
  isSeller?: boolean;
  refreshTokens?: string[];
}

// DTOs
export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  country: string;
  img?: string;
  phone?: string;
  desc?: string;
  isSeller?: boolean;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
