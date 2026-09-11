import { api } from "./axios";
import {
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RefreshRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  TokenResponse,
  UserResponse,
  VerifyEmailRequest,
} from "../../types/auth";

export const registerApi = async (
  data: RegisterRequest
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>("/auth/register", data);
  return response.data;
};

export const loginApi = async (
  data: LoginRequest
): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>("/auth/login", data);
  return response.data;
};

export const logoutApi = async (
  body?: RefreshRequest
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>("/auth/logout", body);
  return response.data;
};

export const getMeApi = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>("/auth/me");
  return response.data;
};

export const refreshTokenApi = async (
  body?: RefreshRequest
): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>("/auth/refresh", body);
  return response.data;
};

export const forgotPasswordApi = async (
  data: ForgotPasswordRequest
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>("/auth/forgot-password", data);
  return response.data;
};

export const resetPasswordApi = async (
  data: ResetPasswordRequest
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>("/auth/reset-password", data);
  return response.data;
};

export const verifyEmailApi = async (
  data: VerifyEmailRequest
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>("/auth/verify-email", data);
  return response.data;
};

export const resendVerificationApi = async (
  data: ResendVerificationRequest
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    "/auth/resend-verification",
    data
  );
  return response.data;
};
