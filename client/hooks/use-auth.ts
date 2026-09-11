"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  registerApi,
  loginApi,
  logoutApi,
  getMeApi,
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailApi,
  resendVerificationApi,
} from "@/lib/api/auth";
import {
  ApiErrorResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
} from "@/types/auth";

// Helper to extract clean error message string from FastAPI error response
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const detail = axiosError.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((err) => err.msg).join(", ");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getMeApi,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => registerApi(data),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPasswordApi(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPasswordApi(data),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => verifyEmailApi(data),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (data: ResendVerificationRequest) => resendVerificationApi(data),
  });
}
