import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { withdrawApi } from "../apis/auth";

export const useWithdrawMutation = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withdrawApi,
        onSuccess: () => {
            alert("회원 탈퇴가 완료되었습니다.");
            logout();
            queryClient.clear();
            navigate("/login");
        },
        onError: (error) => {
            console.error("Withdraw failed:", error);
            alert("회원 탈퇴 중 오류가 발생했습니다.");
        },
    });
};