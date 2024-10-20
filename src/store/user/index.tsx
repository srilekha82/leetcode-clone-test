import { create } from 'zustand';
import { user } from '../../utils/types';

interface userSlice {
  user: user | null;
  setUser: (user: user) => void;
}
export const useUserSlice = create<userSlice>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
}));
