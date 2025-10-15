import { create } from 'zustand';

type PaginationStore = {
  currentPage: number;
  pages: number;
  setPages: (pages: number) => void;
  setCurrentPage: (page: number) => void;
};

export const usePaginationStore = create<PaginationStore>((set) => ({
  currentPage: 1,
  pages: 1,
  setPages: (page: number) => set({ pages: page }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
}));
