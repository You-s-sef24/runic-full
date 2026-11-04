import { useQuery } from "@tanstack/react-query";
import { getNailCost } from "@/api/settings";

export function useGetNailCost() {
  return useQuery({
    queryKey: ["nail-cost"],
    queryFn: getNailCost,
    select: (data) => Number(data?.nailCost ?? 0),
    staleTime: 5 * 60 * 1000,
  });
}
