import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";

interface Author {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface CommentResponse {
  data: {
    data: Comment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export default function useGetLpComments(lpId: string, order: "asc" | "desc") {
  return useInfiniteQuery<CommentResponse, Error>({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getLpComments({ lpId, cursor: pageParam, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled: !!lpId,
    staleTime: 1000 * 60 * 2,
  });
}
