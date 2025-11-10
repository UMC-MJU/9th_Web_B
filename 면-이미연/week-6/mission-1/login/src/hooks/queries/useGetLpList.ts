import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/keys";
import type { Lp } from "../../types/lp";

function useGetLpList({ cursor, search = "", order = "desc", limit }: PaginationDto) {
    return useQuery<Lp[]>({
        queryKey: [QUERY_KEY.lps, { search, order, cursor, limit }],
        queryFn: async () => {
            const res = await getLpList({ cursor, search, order, limit });
            const d: any = res;
            const list =
                Array.isArray(d?.data) ? d.data :
                    Array.isArray(d?.list) ? d.list :
                        Array.isArray(d) ? d :
                            [];
            return list as Lp[];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        placeholderData: (prev) => prev,
    });
}

export default useGetLpList;
