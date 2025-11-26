import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getMyLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/keys";
import type { Lp } from "../../types/lp";

const useGetMyLpList = (paginationDto: PaginationDto) => {
    return useQuery({
        queryKey: [QUERY_KEY.myLps, paginationDto],
        queryFn: async (): Promise<Lp[]> => {
            const res = await getMyLpList(paginationDto);
            return res.data.data;
        },
    });
};

export default useGetMyLpList;