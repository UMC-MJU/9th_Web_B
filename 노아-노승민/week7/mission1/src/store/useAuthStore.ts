import { create } from "zustand";
import { axiosInstance } from "../apis/axios";

interface AuthState {
  isLoggedIn: boolean;
  nickname: string;

  login: (nickname: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;


  setNickname: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  nickname: "",

  login: (nickname) => {
    localStorage.setItem("nickname", nickname);
    set({ isLoggedIn: true, nickname });
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
    } catch {}

    localStorage.clear();
    set({ isLoggedIn: false, nickname: "" });
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      const name = res.data?.data?.name ?? "";

      localStorage.setItem("nickname", name);
      set({ isLoggedIn: true, nickname: name });
    } catch {
      localStorage.clear();
      set({ isLoggedIn: false, nickname: "" });
    }
  },


  setNickname: (name) => {
    localStorage.setItem("nickname", name);
    set({ nickname: name });
  },
}));
