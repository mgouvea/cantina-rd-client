import { create } from "zustand";

// Add the missing User type definition
export type User = {
  _id: string;
  name: string;
  urlImage?: string;
  groupFamily: string;
};

interface UserStore {
  user: User | null;
  update: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  update: (user) => set({ user }),
}));
