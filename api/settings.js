import { api } from "./client";

export async function getNailCost() {
  const res = await api.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/nail-cost`,
  );
  return res.data;
}
