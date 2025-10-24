import { create } from 'zustand';
import { Category } from '@/common/interfaces';

type CategoryStore = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
};

export const useCategoryStore = create<CategoryStore>((set) => {
  return {
    categories: [],
    setCategories: (categories: Category[]) => set({ categories }),
  };
});
