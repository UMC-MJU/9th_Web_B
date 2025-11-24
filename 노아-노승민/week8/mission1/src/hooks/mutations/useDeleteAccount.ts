import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function useDeleteAccount() {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => axiosInstance.delete("/users"),

    onSuccess: () => {
      localStorage.clear();
      logoutStore();
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/login");
    },

    onError: () => {
      alert("회원 탈퇴에 실패했습니다.");
    },
  });
}
