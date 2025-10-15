import { Product } from '@/common/interfaces';
import { create } from 'zustand';

type ProductsStore = {
  products: Product[];
  getProducts: (limit?: number, orderBy?: keyof Product) => Promise<Product[]>;
  // getProduct: (productId: string) => Promise<Product | null>;
  setProducts: (products: Product[]) => void;
  // setProduct: (product: Product) => void;
};

export const useProductsStore = create<ProductsStore>((set, get) => {
  return {
    products: [],
    getProducts: async (limit?: number, orderBy?: keyof Product) => {
      const products = await get().getProducts(limit, orderBy);
      set({ products });
      return products;
    },
    setProducts: (products: Product[]) => {
      set({ products });
    },
  };
});
