import { api } from "./client";

export async function login(user) {
  const res = await api.post(`/users/login`, user);
  return res.data;
}

export async function register(user) {
  const res = await api.post(`/users/register`, user);
  return res.data;
}

export async function updateProfile(user) {
  const res = await api.put(`/users/me`, user);
  return res.data;
}

export async function logout() {
  const res = await api.post(`/users/logout`);
  return res.data;
}
