import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: { ...state.user, ...data },
        })),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => (state, error) => {
        state?.setHasHydrated(!error);
      },
    },
  ),
);
