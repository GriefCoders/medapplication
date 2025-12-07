import { create } from "zustand";
import type { UserStore } from "./index";

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user, isLoading: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
