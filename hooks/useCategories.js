import { getCategories } from "@/api/categories";
import { useQuery } from "@tanstack/react-query";

export function useGetCategories({ page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: ["categories", page, limit],
    queryFn: () => getCategories({ page, limit }),
    placeholderData: (previousData) => previousData,
  });
}
