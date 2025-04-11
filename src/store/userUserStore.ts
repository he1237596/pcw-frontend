import { create } from 'zustand'

interface UserState {
  user: { name: string; email: string; token: string } | null
  setUser: (user: { name: string; email: string; token: string }) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null, // 初始值为空
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))