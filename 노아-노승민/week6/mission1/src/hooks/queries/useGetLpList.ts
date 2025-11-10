import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";

export default function useGetLpList(params: PaginationDto) {
  console.log(" useGetLpList 실행됨", params);
  
  return useQuery({
    queryKey: [QUERY_KEY.lps, params.search, params.order],
    queryFn: () => {
      console.log(" queryFn 실행됨:", params);
      return getLpList(params);
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
    enabled: true, 
  });
}
