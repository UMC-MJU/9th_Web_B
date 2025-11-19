import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/keys";
import type { CommentPage } from "../../types/common";
import { getLpComments } from "../../apis/comment";

type Order = "asc" | "desc";

const useGetLpCommentsInfinite = (params: {
    lpId: number;
    order: Order;
}) => {
    const { lpId, order } = params;

    return useInfiniteQuery<CommentPage>({
        queryKey: [QUERY_KEY.lpComments, lpId, order],
        initialPageParam: 0,
        queryFn: ({ pageParam }) =>
            getLpComments({
                lpId,
                cursor: pageParam as number,
                limit: 10,
                order,
            }),
        getNextPageParam: (lastPage) =>
            lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
    });
};

export default useGetLpCommentsInfinite;
