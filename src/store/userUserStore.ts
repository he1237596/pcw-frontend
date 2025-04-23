import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserInfo, updateUserInfo, UserInfo } from '@api/user';
import { logout } from '@api/user';

// interface UserState {
//   user: { name: string; email: string; token: string } | null;
//   setUser: (user: { name: string; email: string; token: string }) => void;
//   clearUser: () => void;
// }

// export const useUserStore = create<UserState>((set) => ({
//   user: null, // 初始值为空
//   setUser: (user) => set({ user }),
//   clearUser: () => set({ user: null }),
// }));
// export interface UserInfo {
//   id: string
//   name: string
//   roleCode: string
//   roleName: string
//   username: string;
//   email: string;
//   [key: string]: any;
// }

interface AuthState {
  userInfo: UserInfo | null;
  token: string | null;
  loading: boolean;
  permissions: { code: string; name: string }[];
  getUserInfo: (token: string) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  checkHasRole: (code: string) => boolean;
}

export const useUserStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      token: null,
      permissions: [],
      loading: false,
      getUserInfo: async (token) => {
        localStorage.setItem('token', token);
        set({ loading: true });
        const res = await getUserInfo();
        set({ userInfo: res.data, token: token });
        // 如果你有 getPermissions 接口：
        // const perm = await getUserPermissions(res.data.id)
        // set({ permissions: perm.data.map(p => p.code) })
        set({
          permissions: [
            {
              // id: res.data.id,
              code: res.data.roleCode,
              name: res.data.roleName,
            },
          ],
          loading: false,
        });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ userInfo: null, token: null, permissions: [] });
        logout();
      },
      refreshUser: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ loading: true });
          const res = await getUserInfo();
          // const perm = await getUserPermissions(res.data.id)
          set({
            userInfo: res.data,
            token,
            loading: false,
            // permissions: perm.data.map(p => p.code)
          });
        }
      },
      checkHasRole: (code: string) => {
        const { permissions } = get();
        const keys = permissions.map(
          (p: { code: string; name: string }) => p.code,
        );
        return keys.includes('Sadmin') || keys.includes(code);
      },
    }),
    { name: 'auth-store' }, // 本地存储 key
  ),
);
