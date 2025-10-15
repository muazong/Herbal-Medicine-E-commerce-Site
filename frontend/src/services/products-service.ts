import { Product } from '@/common/interfaces';
import { api } from './axios-instance';

async function getProducts(
  limit?: number,
  page: number = 1,
  orderBy: keyof Product = 'createdAt',
) {
  try {
    const response = await api.get(
      `/products?limit=${limit}&page=${page}&orderBy=${orderBy}`,
    );
    return response.data as Product[];
  } catch {
    return null;
  }
}

async function getProductsPages() {
  try {
    const response = await api.get('/products/pages');
    return response.data as number;
  } catch {
    return null;
  }
}

async function getProduct(productId: string) {
  try {
    const response = await api.get(`/products/${productId}`);
    const product = response.data as Product;
    return product;
  } catch {
    return null;
  }
}

async function searchProducts(search: string) {
  try {
    const response = await api.get(`/products?search=${search}`);
    if (!response.data) return null;
    return response.data as Product[];
  } catch {
    return null;
  }
}

export { getProducts, getProduct, getProductsPages, searchProducts };
