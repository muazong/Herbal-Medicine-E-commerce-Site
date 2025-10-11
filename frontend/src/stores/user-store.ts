import { User } from '@/common/interfaces';
import { create } from 'zustand';

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  getUser: () => User | null;
};

export const useUserStore = create<UserStore>((set, get) => {
  return {
    user: null,
    getUser: () => get().user,
    setUser: (user) => set({ user }),
  };
});
