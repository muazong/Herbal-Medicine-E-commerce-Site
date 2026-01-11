import { ORDER_STATUS, PAYMENT_METHOD } from '@/common/enums';
import { Order } from '@/common/interfaces';
import { apiWithAuth } from '@/services/axios-instance-client';

export type OrderFormData = {
  paymentMethod: PAYMENT_METHOD;
  phoneNumber: string;
  shippingAddress: string;
  userName: string;
  status?: ORDER_STATUS;
};

export const getOrders = async () => {
  try {
    const response = await apiWithAuth.get('orders');
    if (!response.data) return null;
    return response.data as Order[];
  } catch {
    return null;
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const response = await apiWithAuth.get(`/orders/${orderId}`);
    if (!response.data) return null;
    return response.data;
  } catch {
    return null;
  }
};

export const getUserOrders = async (orderBy: keyof Order) => {
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

export const getUserOrder = async (orderId: string) => {
  try {
    const response = await apiWithAuth.get(`orders/${orderId}`);
    if (!response.data) return null;
    return response.data as Order;
  } catch {
    return null;
  }
};

export const orderUserProducts = async (orderData: OrderFormData) => {
  try {
    const response = await apiWithAuth.post('/orders/products', orderData);
    if (!response.data) return null;
    return response.data;
  } catch {
    return null;
  }
};

export const updateUserOrder = async (
  orderData: Partial<Omit<OrderFormData, 'userName'>>,
) => {
  try {
    const response = await apiWithAuth.patch('/orders', orderData);
    if (!response.data) return null;
    return response.data;
  } catch {
    return null;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: ORDER_STATUS,
) => {
  try {
  } catch {
    return null;
  }
};
