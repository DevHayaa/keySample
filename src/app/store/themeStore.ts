import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type StoreState = {
  bears: number;
  theme: string;
  users: Record<string, any> | null; // Allow null for hydration handling
  email: Record<string, any> | null;
  increasePopulation: () => void;
  changeTheme: (newTheme: string) => void;
  updateUser: (newUser: Record<string, any>) => void;
  otpEmail: (newEmail: Record<string, any>) => void;
};

export const Store = create<StoreState>()(
  persist(
    (set) => ({
      bears: 0,
      theme: 'dark',
      users: null,  // Initially null to prevent overwriting with empty object
      email: null,
      increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
      changeTheme: (newTheme: any) => set({ theme: newTheme }),
      updateUser: (newUser: any) => set({ users: newUser }),
      otpEmail: (newEmail: any) => set({ email: newEmail }),
    }),
    {
      name: 'bears-store',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null; // Prevent SSR issues
          const storedValue = sessionStorage.getItem(name);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(name);
          }
        },
      },
      partialize: (state: any) => ({
        theme: state.theme,
        users: state.users,
        email: state.email,
      }),
    }
  )
);
