import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/keys";
import { updateLp } from "../../apis/lp";
import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp";

export const useUpdateLpMutation = (lpId: number) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (formData: FormData) => updateLp(lpId, formData),
        onSuccess: (updatedLp: Lp) => {
            queryClient.setQueryData([QUERY_KEY.lps, lpId], updatedLp);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
            alert("게시글이 수정되었습니다.");
            navigate(`/lp/${lpId}`); // 수정된 상세 페이지로 이동
        },
        onError: () => {
            alert("게시글 수정에 실패했습니다.");
        },
    });
};