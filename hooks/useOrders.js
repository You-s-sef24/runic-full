import { createOrder, getUserOrders } from "@/api/orders";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useGetUserOrders(id) {
  return useQuery({
    queryKey: ["userOrders"],
    queryFn: () => getUserOrders(id),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateOrder() {
  const router = useRouter();

  return useMutation({
    mutationFn: (orderData) => createOrder(orderData),

    mutationKey: ["order"],

    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/orders");
    },

    onError: (error) => {
      console.error("Order error:", error.response?.data);
      toast.error(error?.message || "Error creating order");
    },
  });
}
