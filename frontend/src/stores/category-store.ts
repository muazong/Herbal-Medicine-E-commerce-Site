import { create } from 'zustand';
import { Category } from '@/common/interfaces';

type CategoryStore = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  deleteCategory: (categoryId: string) => void;
};

export const useCategoryStore = create<CategoryStore>((set, get) => {
  return {
    categories: [],
    setCategories: (categories: Category[]) => set({ categories }),
    deleteCategory: (categoryId: string) => {
      const category = get().categories.find((c) => c.id === categoryId);
      if (!category) return null;
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
      }));
      return category;
    },
  };
});
