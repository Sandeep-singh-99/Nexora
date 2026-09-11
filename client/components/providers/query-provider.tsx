"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: unknown) => {
              // Don't retry on 401, 403 or 404
              if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as AxiosError;
                const status = axiosError.response?.status;
                if (status === 401 || status === 403 || status === 404) {
                  return false;
                }
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
