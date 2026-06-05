import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "./env";
import { authStorage } from "../utils/auth";

export const http = axios.create({
  baseURL: env.NEXT_PUBLIC_APP_API,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de REQUEST
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStorage.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);
