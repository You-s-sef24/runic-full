import { create } from "zustand";
import { persist } from "zustand/middleware";

const keyOf = (item) => item._id ?? item.id;

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      nails: 0,

      addToCart: (product) =>
        set((state) => {
          const key = keyOf(product);
          const existing = state.cart.find((item) => keyOf(item) === key);

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                keyOf(item) === key
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                _id: key,
                name: product.name,
                price: Number(product.price),
                images: (product.images ?? []).slice(0, 1),
                quantity: 1,
              },
            ],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => keyOf(item) !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            keyOf(item) === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        })),

      setNails: (nails) => set({ nails: Math.max(0, nails) }),

      clearCart: () => set({ cart: [], nails: 0 }),

      getTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: "cart-storage" },
  ),
);
