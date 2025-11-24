import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function useLogin() {
  const navigate = useNavigate();
  const loginToStore = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await axiosInstance.post("/auth/signin", { email, password });
      return res.data.data;
    },

    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      loginToStore(data.name);

      navigate("/");
    },

    onError: () => {
      alert("로그인 실패. 이메일 또는 비밀번호를 확인해주세요.");
    },
  });
}
