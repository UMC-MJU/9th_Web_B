import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/keys";
import { postLike, deleteLike } from "../../apis/lp";
import type { Lp } from "../../types/lp";
import { useGetMyInfo } from "./useGetMyInfo";

export const useToggleLikeMutation = (lpId: number, isLiked: boolean) => {
    const queryClient = useQueryClient();
    const { data: myInfo } = useGetMyInfo();
    const currentUserId = myInfo?.data?.id;

    return useMutation({
        mutationFn: () => (isLiked ? deleteLike(lpId) : postLike(lpId)),

        // 낙관적 업데이트
        onMutate: async () => {
            if (!currentUserId) return;

            await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps, lpId] });

            const previousLpData = queryClient.getQueryData<Lp>([
                QUERY_KEY.lps,
                lpId,
            ]);

            if (previousLpData) {
                const newLikes = isLiked
                    ? previousLpData.likes.filter(
                        (like) => like.userId !== currentUserId
                    )
                    : [
                        ...previousLpData.likes,
                        { id: Date.now(), userId: currentUserId, lpId },
                    ];

                queryClient.setQueryData<Lp>([QUERY_KEY.lps, lpId], {
                    ...previousLpData,
                    likes: newLikes,
                });
            }

            return { previousLpData };
        },

        // 실패 시 롤백
        onError: (_err, _var, context) => {
            if (context?.previousLpData) {
                queryClient.setQueryData(
                    [QUERY_KEY.lps, lpId],
                    context.previousLpData
                );
            }
            alert("좋아요 처리에 실패했습니다.");
        },

        // 서버와 동기화
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId] });
        },
    });
};