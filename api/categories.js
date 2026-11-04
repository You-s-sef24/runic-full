import { api } from "./client";

export async function getCategories({ page = 1, limit = 10 }) {
  const res = await api.get("/category", { params: { page, limit } });
  return res.data;
}
