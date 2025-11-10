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
