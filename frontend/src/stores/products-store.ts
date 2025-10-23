import { Product } from '@/common/interfaces';
import { create } from 'zustand';

type ProductsStore = {
  products: Product[];
  getProducts: (limit?: number, orderBy?: keyof Product) => Promise<Product[]>;
  setProducts: (products: Product[]) => void;
  deleteProduct: (productId: string) => Product | null;
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
    deleteProduct: (productId: string) => {
      const product = get().products.find((p) => p.id === productId);
      if (!product) return null;
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
      }));
      return product;
    },
  };
});
