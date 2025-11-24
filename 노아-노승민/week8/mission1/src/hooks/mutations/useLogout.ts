import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const navigate = useNavigate();
  const setLogout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => axiosInstance.post("/auth/signout"),

    onSuccess: () => {
      localStorage.clear();
      setLogout();
      navigate("/login");
    },

    onError: () => {
      alert("로그아웃 실패");
    },
  });
}
