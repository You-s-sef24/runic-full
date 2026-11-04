import { useQuery } from "@tanstack/react-query";
import {
  getBestSellingProducts,
  getFeaturedProducts,
  getProductById,
  getProducts,
  getProductsByCategory,
} from "@/api/products";

export function useGetProducts({
  page = 1,
  limit = 10,
  sortBy,
  order,
  category,
} = {}) {
  return useQuery({
    queryKey: ["products", page, limit, sortBy, order, category],
    queryFn: () => getProducts({ page, limit, sortBy, order, category }),
    placeholderData: (previousData) => previousData,
  });
}

export function useGetProductsByCategory({
  page = 1,
  limit = 10,
  sortBy,
  order,
  categoryId,
} = {}) {
  return useQuery({
    queryKey: ["products", page, limit, sortBy, order, categoryId],
    queryFn: () =>
      getProductsByCategory({ page, limit, sortBy, order, categoryId }),
    enabled: !!categoryId,
    placeholderData: (previousData) => previousData,
  });
}

export function useGetFeaturedProducts({
  page = 1,
  limit = 10,
  sortBy,
  order,
  category,
} = {}) {
  return useQuery({
    queryKey: ["featured", page, limit, sortBy, order, category],
    queryFn: () =>
      getFeaturedProducts({ page, limit, sortBy, order, category }),
    placeholderData: (previousData) => previousData,
  });
}

export function useGetBestSellingProducts({
  page = 1,
  limit = 10,
  sortBy,
  order,
  category,
} = {}) {
  return useQuery({
    queryKey: ["bestsellers", page, limit, sortBy, order, category],
    queryFn: () =>
      getBestSellingProducts({ page, limit, sortBy, order, category }),
    placeholderData: (previousData) => previousData,
  });
}

export function useGetProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}
