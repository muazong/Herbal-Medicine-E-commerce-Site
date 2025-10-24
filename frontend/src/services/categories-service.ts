import { api } from './axios-instance';
import { Category, Product } from '@/common/interfaces';
import { apiWithAuth } from './axios-instance-client';

async function getCategories(limit?: number) {
  try {
    const response = await api.get(
      `/categories${limit ? `?limit=${limit}` : ''}`,
    );
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

async function assignCategoryToProduct(productId: string, categoryId: string) {
  try {
    const response = await apiWithAuth.post(
      `/products/${productId}/category/${categoryId}`,
    );

    if (!response.data) return null;
    return response.data;
  } catch {
    return null;
  }
}

export { getCategories, getProductsByCategory, assignCategoryToProduct };
