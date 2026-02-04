// API Response Types
export interface ApiTestResponse {
  message: string;
  timestamp: string;
  data?: unknown;
}

export interface ApiHealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

export interface LoginResponse {
  token: string;
  refresh_token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  agreeTerms?: boolean;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

export type ArrivalState = "Pending" | "Checked In";

export interface User {
  id: number;
  name: string;
  email: string;
  team: string;
  track: "Software" | "Hardware";
  state: ArrivalState;
}