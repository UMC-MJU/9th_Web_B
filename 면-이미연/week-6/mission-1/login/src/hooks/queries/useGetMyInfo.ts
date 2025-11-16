import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/keys";
import type { ResponseMyInfoDto } from "../../types/auth";

export const useGetMyInfo = () => {
    return useQuery<ResponseMyInfoDto>({
        queryKey: [QUERY_KEY.myInfo],
        queryFn: getMyInfo,
        staleTime: 1000 * 60 * 5, // 5분
    });
};