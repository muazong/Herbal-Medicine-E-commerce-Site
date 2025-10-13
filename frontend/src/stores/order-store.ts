import { Order } from '@/common/interfaces';
import { create } from 'zustand';

type OrderStore = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  getOrders: () => Order[];
};

export const useOrderStore = create<OrderStore>((set, get) => {
  return {
    orders: [],
    getOrders: () => get().orders,
    setOrders: (orders: Order[]) => set({ orders }),
  };
});
