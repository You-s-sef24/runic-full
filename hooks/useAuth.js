import { login, logout, register, updateProfile } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogin(user) {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: () => login(user),
    mutationKey: ["user"],

    onSuccess: (data) => {
      if (data.user.isAdmin) {
        toast.error("This account is not allowed to log in to the website.");
        return;
      }
      setUser(data.user);
      toast.success(data.message);
      router.push("/");
    },
    onError: () => toast.error("Login Failed"),
  });
}

export function useRegister(user) {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: () => register(user),
    mutationKey: ["user"],
    onSuccess: (data) => {
      setUser(data.user);
      toast.success(data.message);
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration Failed");
    },
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      const current = useAuthStore.getState().user;
      setUser({ ...current, ...data.user });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update Profile Failed");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: (data) => toast.success(data.message),
    onSettled: () => {
      queryClient.clear();
      setUser(null);
      router.push("/");
    },
  });
}
