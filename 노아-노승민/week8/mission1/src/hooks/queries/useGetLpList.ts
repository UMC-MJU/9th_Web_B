import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";

interface LpItem {
  id: number;
  title: string;
  thumbnail: string;
  createdAt: string;
  likes: number;
}

interface LpListResponse {
  data: {
    data: LpItem[];
    nextCursor?: number | null;
    hasNext: boolean;
  };
}

export default function useGetLpList(params: PaginationDto) {
  console.log(" useGetLpList 실행됨", params);

  return useInfiniteQuery<LpListResponse, Error>({

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
        ? (lastPage.data.nextCursor ?? undefined)
        : undefined,

   
    staleTime: 1000 * 60 * 2,

   
    initialPageParam: 0,
  });
}
