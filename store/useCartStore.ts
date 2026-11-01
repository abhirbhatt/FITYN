import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItemReference {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItemReference[];
  isOpen: boolean;
  hasHydrated: boolean;

  // Actions
  addItem: (item: Omit<CartItemReference, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId: string, size: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    size: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      addItem: ({ productId, variantId, size, quantity = 1 }) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === productId &&
              item.variantId === variantId &&
              item.size === size,
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated, isOpen: true };
          }

          return {
            items: [...state.items, { productId, variantId, size, quantity }],
            isOpen: true,
          };
        }),

      removeItem: (productId, variantId, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantId === variantId &&
                item.size === size
              ),
          ),
        })),

      updateQuantity: (productId, variantId, size, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(
                    item.productId === productId &&
                    item.variantId === variantId &&
                    item.size === size
                  ),
              ),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId &&
              item.variantId === variantId &&
              item.size === size
                ? { ...item, quantity }
                : item,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'fityn-cart-v1',
      storage: createJSONStorage(() => localStorage),
      // Only persist raw item references (productId, variantId, size, quantity)
      partialize: (state) => ({
        items: state.items.map(({ productId, variantId, size, quantity }) => ({
          productId,
          variantId,
          size,
          quantity,
        })),
      }) as unknown as CartState,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

