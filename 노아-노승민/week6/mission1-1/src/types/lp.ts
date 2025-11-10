import type { CommonResponse } from "./common";

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
}

export type ResponseLpListDto = CommonResponse<{
  data: Lp[];
  nextCursor: number | null;
  hasNext: boolean;
}>;
