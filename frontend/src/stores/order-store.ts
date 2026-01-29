import { ORDER_STATUS } from '@/common/enums';
import { Order } from '@/common/interfaces';
import { create } from 'zustand';

type OrderStore = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  getOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: ORDER_STATUS) => void;
};

export const useOrderStore = create<OrderStore>((set, get) => {
  return {
    orders: [],
    getOrders: () => get().orders,
    setOrders: (orders: Order[]) => set({ orders }),
    updateOrderStatus: (orderId, status) =>
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      })),
  };
});
