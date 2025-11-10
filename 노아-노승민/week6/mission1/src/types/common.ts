import type { PAGINATION_ORDER } from "../enum/common";

export interface PaginationDto {
  cursor?: number | null;
  limit?: number;
  search?: string;
  order?: PAGINATION_ORDER;
}

export interface CommonResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}
