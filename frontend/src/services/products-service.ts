import { Product } from '@/common/interfaces';
import { api } from './axios-instance';
import { apiWithAuth } from './axios-instance-client';

export type CreateProduct = Pick<
  Product,
  'name' | 'price' | 'stock' | 'description'
>;

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

async function createProduct(product: CreateProduct) {
  try {
    const response = await apiWithAuth.post('/products', product);
    return response.data;
  } catch {
    throw new Error('Lỗi tạo sản phẩm');
  }
}

async function addProductImages(productId: string, files: File[]) {
  try {
    const response = await apiWithAuth.post(
      `/products/${productId}/images`,
      files,
    );
    return response.data;
  } catch {
    return null;
  }
}

async function deleteProduct(productId: string) {
  try {
    const response = await apiWithAuth.delete(`/products/${productId}`);
    return response.data;
  } catch {
    throw new Error('Lỗi xóa sản phẩm');
  }
}

export {
  getProducts,
  getProduct,
  getProductsPages,
  searchProducts,
  createProduct,
  addProductImages,
  deleteProduct,
};
