'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order } from '@/lib/types/commerce';

interface OrderState {
  currentOrder: Order | null;
  orders: Order[];
  setCurrentOrder: (order: Order) => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      currentOrder: null,
      orders: [],
      setCurrentOrder: (order: Order) =>
        set((state) => ({
          currentOrder: order,
          orders: [order, ...state.orders],
        })),
      clearCurrentOrder: () => set({ currentOrder: null }),
    }),
    {
      name: 'fityn-orders-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : (null as any),
      ),
    },
  ),
);

