import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

export default function useSearchLpList(params: PaginationDto) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, params.search, params.order],

    queryFn: async ({ pageParam = 0 }) => {
      const response = await getLpList({
        ...params,
        cursor: pageParam,
      });
      return response;
    },

    getNextPageParam: (lastPage) =>
      lastPage.data?.hasNext
        ? lastPage.data.nextCursor ?? undefined
        : undefined,

    enabled:
      params.search !== undefined &&
      params.search.trim().length > 0, // 검색어 있을 때만 실행
  
    staleTime: 1000 * 60 * 2,
    initialPageParam: 0,
  });
}
