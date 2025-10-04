import { api } from './axios-instance';
import { Category } from '@/common/interfaces';

async function getCategories(limit?: number) {
  try {
    const response = await api.get(`/categories?limit=${limit}`);
    return response.data as Category[];
  } catch {
    return null;
  }
}

export { getCategories };
