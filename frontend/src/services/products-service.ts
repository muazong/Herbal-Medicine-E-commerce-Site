import { Product } from '@/common/interfaces';
import { api } from './axios-instance';

async function getProducts(
  limit?: number,
  orderBy: keyof Product = 'createdAt',
) {
  try {
    const response = await api.get(
      `/products?limit=${limit}&orderBy=${orderBy}`,
    );
    return response.data as Product[];
  } catch {
    return null;
  }
}

export { getProducts };
