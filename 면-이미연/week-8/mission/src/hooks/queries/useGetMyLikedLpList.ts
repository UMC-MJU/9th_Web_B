import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getMyLikedLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/keys";
import type { Lp } from "../../types/lp";

const useGetMyLikedLpList = (paginationDto: PaginationDto) => {
    return useQuery({
        queryKey: [QUERY_KEY.myLikedLps, paginationDto],
        queryFn: async (): Promise<Lp[]> => {
            const res = await getMyLikedLpList(paginationDto);
            return res.data.data;
        },
    });
};

export default useGetMyLikedLpList;