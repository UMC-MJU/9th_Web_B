// src/apis/lp.ts
import { axiosInstance } from "./axios";
import type { ResponseLpListDto } from "../types/lp";
import type { PaginationDto } from "../types/common";

/* LP 리스트 */
export const getLpList = async (
  params: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get<ResponseLpListDto>("/lps", { params });
  return data;
};

/* LP 상세 조회 */
export const getLpDetail = async (lpId: string) => {
  const { data } = await axiosInstance.get(`/lps/${lpId}`);
  return data.data;
};

/* 댓글 목록 */
export const getLpComments = async ({ lpId, cursor, limit = 10, order = "desc" }) => {
  const { data } = await axiosInstance.get(`/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });
  return data;
};

/* 댓글 생성 */
export const postLpComment = async (lpId: string, content: string) => {
  const { data } = await axiosInstance.post(`/lps/${lpId}/comments`, { content });
  return data;
};

/* 댓글 수정 */
export const patchLpComment = async (lpId: string, commentId: number, content: string) => {
  const { data } = await axiosInstance.patch(
    `/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data;
};

/* 댓글 삭제 */
export const deleteLpComment = async (lpId: string, commentId: number) => {
  const { data } = await axiosInstance.delete(
    `/lps/${lpId}/comments/${commentId}`
  );
  return data;
};

export const deleteLp = (lpId: number) => {
  return axiosInstance.delete(`/lps/${lpId}`);
};

// LP 좋아요
export const likeLp = (lpId: number) => {
  return axiosInstance.post(`/lps/${lpId}/likes`);
};



export type CreateLpPayload = {
  title: string;
  content: string;
  tags: string[];
  thumbnail?: string;      
  published?: boolean;     
};

export const createLp = async ({
  title,
  content,
  tags,
  thumbnail = "",
  published = true,
}: CreateLpPayload) => {
  const { data } = await axiosInstance.post("/lps", {
    title,
    content,
    tags,
    thumbnail,   
    published,
  });

  return data;
};
export const updateLp = (lpId: number, payload: { title: string }) => {
  return axiosInstance.patch(`/lps/${lpId}`, payload);
};