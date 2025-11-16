import type { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import type { ResponseLpListDto, ResponseLpDetailDto, Lp } from "../types/lp";

/* LP 목록 조회 */
export const getLpList = async (
    paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get<ResponseLpListDto>("/v1/lps", {
        params: paginationDto,
    });
    return data;
};

/* LP 상세 조회 */
export const getLpDetail = async (id: number): Promise<Lp> => {
    const { data } = await axiosInstance.get<ResponseLpDetailDto>(`/v1/lps/${id}`);
    return data.data;
};

/* LP 생성 */
export const postLp = async (formData: FormData): Promise<void> => {
    await axiosInstance.post("/v1/lps", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

/* LP 좋아요 추가 */
export const postLike = async (id: number): Promise<void> => {
    await axiosInstance.post(`/v1/lps/${id}/likes`);
};

/* LP 좋아요 취소 */
export const deleteLike = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${id}/likes`);
};

/* LP 삭제 */
export const deleteLp = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${id}`);
};

/* LP 수정 */
export const updateLp = async (id: number, formData: FormData): Promise<Lp> => {
    const { data } = await axiosInstance.patch<ResponseLpDetailDto>(
        `/v1/lps/${id}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return data.data;
};