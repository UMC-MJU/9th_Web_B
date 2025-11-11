import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/keys";
import type { LpDetail } from "../../types/lp";

function useGetLpDetail(lpId: number) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, lpId],
        queryFn: async () => {
            const res = await getLpDetail(lpId);
            
            return res.data as LpDetail; 
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        enabled: !!lpId,
    });
}

export default useGetLpDetail;