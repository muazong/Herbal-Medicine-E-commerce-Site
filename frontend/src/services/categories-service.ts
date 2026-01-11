import { api } from './axios-instance';
import { Category, Product } from '@/common/interfaces';
import { apiWithAuth } from './axios-instance-client';

async function getCategories(limit?: number, page: number = 1) {
  try {
    const response = await api.get(
      `/categories${limit ? `?limit=${limit}` : ''}&page=${page}`,
    );
    return response.data as Category[];
  } catch {
    return null;
  }
}

async function getCategoriesPages() {
  try {
    const response = await api.get('/categories/pages');
    return response.data as number;
  } catch {
    return null;
  }
}

async function getProductsByCategory(categoryId: string, limit?: number) {
  try {
    const response = await api.get(
      `/categories/${categoryId}/products?limit=${limit}`,
    );

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

async function unssignCategoryToProduct(productId: string) {
  try {
    const response = await apiWithAuth.delete(
      `/products/${productId}/category`,
    );
    if (!response.data) return null;
    return response.data;
  } catch {
    return null;
  }
}

async function deleteCategory(categoryId: string) {
  try {
    const response = await apiWithAuth.delete(`/categories/${categoryId}`);
    return response.data;
  } catch {
    return null;
  }
}

export {
  getCategories,
  deleteCategory,
  getCategoriesPages,
  getProductsByCategory,
  assignCategoryToProduct,
  unssignCategoryToProduct,
};
