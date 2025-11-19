import { axiosInstance } from "./axios";
import type { Comment, CommentListResponse, CommentPage, CommonResponse } from "../types/common";

type Order = "asc" | "desc";

export const getLpComments = async (params: {
    lpId: number;
    cursor: number;
    limit: number;
    order: Order;
}): Promise<CommentPage> => {
    const { lpId, cursor, limit, order } = params;

    const { data } = await axiosInstance.get<CommentListResponse>(
        `/v1/lps/${lpId}/comments`,
        {
            params: { cursor, limit, order },
        }
    );

    return data.data;
};

export const postLpComment = async (params: {
    lpId: number;
    content: string;
}): Promise<Comment> => {
    const { lpId, content } = params;

    const { data } = await axiosInstance.post<CommonResponse<Comment>>(
        `/v1/lps/${lpId}/comments`,
        { content }
    );

    return data.data;
};

export const patchLpComment = async (params: {
    lpId: number;
    commentId: number;
    content: string;
}): Promise<Comment> => {
    const { lpId, commentId, content } = params;

    const { data } = await axiosInstance.patch<CommonResponse<Comment>>(
        `/v1/lps/${lpId}/comments/${commentId}`,
        { content }
    );

    return data.data;
};

export const deleteLpComment = async (params: {
    lpId: number;
    commentId: number;
}): Promise<void> => {
    const { lpId, commentId } = params;

    await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};
