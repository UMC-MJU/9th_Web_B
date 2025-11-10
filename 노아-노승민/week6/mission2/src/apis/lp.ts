import { axiosInstance } from "./axios";
import type { ResponseLpListDto } from "../types/lp";
import type { PaginationDto } from "../types/common";

export const getLpList = async (
  params: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get<ResponseLpListDto>("/lps", { params });
  return data;
};

export const getLpDetail = async (lpId: string) => {
  const { data } = await axiosInstance.get(`/lps/${lpId}`);
  return data.data; 
};

// 댓글 목록 조회 (무한스크롤용)
export const getLpComments = async ({
  lpId,
  cursor,
  limit = 10,
  order = "desc",
}: {
  lpId: string;
  cursor?: number | null;
  limit?: number;
  order?: "asc" | "desc";
}) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });
  return data; 
  // data.data = { data: Comment[], nextCursor, hasNext }
};

// 댓글 작성
export const postLpComment = async (lpId: string, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
};