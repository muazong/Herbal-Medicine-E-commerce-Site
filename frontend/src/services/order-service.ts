import { Order } from '@/common/interfaces';
import { apiWithAuth } from '@/services/axios-instance-client';

export const getOrders = async (orderBy: keyof Order) => {
  try {
    const response = await apiWithAuth.get(
      `orders/user/products?orderBy=${orderBy}`,
    );
    if (!response.data) return null;
    return response.data as Order[];
  } catch {
    return null;
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const response = await apiWithAuth.get(`orders/${orderId}`);
    if (!response.data) return null;
    return response.data as Order;
  } catch {
    return null;
  }
};

export const orderProducts = async () => {
  try {
    const response = await apiWithAuth.post('/orders/products');
    if (!response.data) return null;
    return response.data;
  } catch {
    return null;
  }
};
