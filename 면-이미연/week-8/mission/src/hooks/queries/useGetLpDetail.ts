import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/keys";
import { getLpDetail } from "../../apis/lp";
import type { Lp } from "../../types/lp";

function useGetLpDetail(lpId: number) {
    return useQuery<Lp>({
        queryKey: [QUERY_KEY.lps, lpId],
        queryFn: () => getLpDetail(lpId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        enabled: !!lpId,
    });
}

export default useGetLpDetail;
