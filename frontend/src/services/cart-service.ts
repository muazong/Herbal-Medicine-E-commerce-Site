import { AxiosError } from 'axios';
import { apiWithAuth } from './axios-instance-client';
import { PATH } from '@/common/enums';

export async function addProductToCart(productId: string, quantity: number) {
  try {
    const res = await apiWithAuth.post('/carts/add', {
      productId,
      quantity,
    });

    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      return (window.location.href = PATH.LOGIN);
    }
    throw error;
  }
}
