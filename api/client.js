import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const { user, setUser } = useAuthStore.getState();
    if (err.response?.status === 401 && user) setUser(null);
    return Promise.reject(err);
  },
);
