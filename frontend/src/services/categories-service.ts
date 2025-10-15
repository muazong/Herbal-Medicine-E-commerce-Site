import { api } from './axios-instance';
import { Category, Product } from '@/common/interfaces';

async function getCategories(limit?: number) {
  try {
    const response = await api.get(`/categories?limit=${limit}`);
    return response.data as Category[];
  } catch {
    return null;
  }
}

async function getProductsByCategory(categoryId: string, limit?: number) {
  try {
    const response = await api.get(
      `/categories/${categoryId}/products?limit=${limit}`,
    );

    console.log(response.data);

    return response.data as Product[];
  } catch {
    return null;
  }
}

export { getCategories, getProductsByCategory };
