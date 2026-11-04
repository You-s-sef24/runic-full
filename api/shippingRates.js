import { api } from "./client";

export async function getShippingRates() {
  const res = await api.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/shipping-rates`,
    { params: { active: true, limit: 100 } },
  );
  return res.data;
}
