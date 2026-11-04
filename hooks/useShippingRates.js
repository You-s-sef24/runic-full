import { useQuery } from "@tanstack/react-query";
import { getShippingRates } from "@/api/shippingRates";

export function useGetShippingRates() {
  return useQuery({
    queryKey: ["shipping-rates", "active"],
    queryFn: getShippingRates,
    staleTime: 5 * 60 * 1000,
  });
}
