import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import type { Lp } from "../../types/lp";
import { QUERY_KEY } from "../../constants/keys";

function useGetLpList({
    cursor = 0,
    search = "",
    order = "desc",
    limit = 20,
}: PaginationDto) {
    return useQuery<Lp[]>({
        queryKey: [QUERY_KEY.lps, search, order, limit],
        queryFn: async () => {
            const res = await getLpList({ cursor, search, order, limit });
            return res.data.data as Lp[];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        placeholderData: (prev) => prev,
    });
}

export default useGetLpList;
