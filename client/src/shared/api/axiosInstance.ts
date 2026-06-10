import axios from "axios";
import { store } from "@app/providers/store/store.ts";
import { sessionCleared, sessionEstablished } from "@/entities/session/model/session.actions.ts";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const hasBearerToken = (authHeader: unknown) =>
  typeof authHeader === "string" && authHeader.startsWith("Bearer ");

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().session.accessToken;
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authHeader =
      originalRequest?.headers?.Authorization ?? originalRequest?.headers?.authorization;

    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      !originalRequest.url?.includes("/auth/refresh") &&
      hasBearerToken(authHeader)
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosInstance.post("/auth/refresh", undefined, {
          skipAuthRefresh: true,
        });
        const { accessToken, user } = refreshResponse.data;
        store.dispatch(sessionEstablished({ user, accessToken }));
        originalRequest.headers ??= {};
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        store.dispatch(sessionCleared());
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
