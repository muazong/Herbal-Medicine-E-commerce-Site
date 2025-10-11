import { AxiosError } from 'axios';
import { apiWithAuth } from './axios-instance-client';
import { PATH } from '@/common/enums';
import { CartItem } from '@/common/interfaces';

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

export async function getProductsFromUserCart() {
  try {
    const response = await apiWithAuth.get('/carts/user/products');
    if (!response) return null;
    return response.data as CartItem[];
  } catch {
    return null;
  }
}

export async function deleteProductFromUserCart(productId: string) {
  try {
    const response = await apiWithAuth.delete(`/carts/product/${productId}`);

    if (!response) return null;
    return response.data;
  } catch {
    return null;
  }
}

export async function updateCartItemQuantityFromUserCart(
  productId: string,
  quantity: number,
) {
  try {
    const response = await apiWithAuth.patch('/carts/update-quantity', {
      productId,
      quantity,
    });

    if (!response) return null;
    return response.data;
  } catch {
    return null;
  }
}
