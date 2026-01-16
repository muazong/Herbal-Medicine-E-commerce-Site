import { User } from '@/common/interfaces';
import { create } from 'zustand';

type UsersStore = {
  users: User[];
  setUsers: (users: User[]) => void;
  getUsers: () => User[] | null;
};

export const useUsersStore = create<UsersStore>((set, get) => {
  return {
    users: [],
    setUsers: (users) => set({ users: users }),
    getUsers: () => get().users,
  };
});
