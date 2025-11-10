import { create } from "zustand";
import { axiosInstance } from "../apis/axios";

interface AuthState {
  isLoggedIn: boolean;
  nickname: string;
  login: (nickname: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  nickname: "",

  login: (nickname) => set({ isLoggedIn: true, nickname }),

  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
    } catch {}
    localStorage.clear();
    set({ isLoggedIn: false, nickname: "" });
  },

  checkAuth: async () => {
    try {
      await axiosInstance.get("/auth/protected");
      const name = localStorage.getItem("userName") || "";
      set({ isLoggedIn: true, nickname: name });
    } catch {
      localStorage.clear();
      set({ isLoggedIn: false, nickname: "" });
    }
  },
}));
