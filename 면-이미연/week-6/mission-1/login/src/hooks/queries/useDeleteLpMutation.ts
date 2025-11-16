import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/keys";
import { deleteLp } from "../../apis/lp";
import { useNavigate } from "react-router-dom";

export const useDeleteLpMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (lpId: number) => deleteLp(lpId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
            alert("게시글이 삭제되었습니다.");
            navigate("/"); // 홈으로 이동
        },
        onError: () => {
            alert("게시글 삭제에 실패했습니다.");
        },
    });
};