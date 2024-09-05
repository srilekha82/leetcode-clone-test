import { create } from 'zustand';
import { User } from '../../utils/types';

interface userSlice {
  user: User | null;
  setUser: (user: User) => void;
}
export const useUserSlice = create<userSlice>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
}));
