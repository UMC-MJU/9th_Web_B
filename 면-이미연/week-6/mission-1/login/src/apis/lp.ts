import type { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import type { ResponseLpListDto, Lp } from "../types/lp";

/* LP 목록 조회 */
export const getLpList = async (
    paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get("/v1/lps", { params: paginationDto });
    return data;
};

/* LP 상세 조회 */
export const getLpDetail = async (id: number): Promise<Lp> => {
    const { data } = await axiosInstance.get(`/v1/lps/${id}`);
    return data.data ?? data;
};
