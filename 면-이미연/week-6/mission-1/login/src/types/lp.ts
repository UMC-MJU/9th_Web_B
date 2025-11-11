import type { CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
};

export type Like = {
    id: number;
    userId: number;
    lpId: number;
};

export type Author = {
    id: number;
    name: string;
    email?: string;
    avatar?: string | null;
    bio?: string | null;
};

export type Lp = {
    data: LpDetail;
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string; 
    tags: Tag[];
    likes: Like[];
    author?: Author;
};

export type LpDetail = Lp & {
    author: Author; // 필수 author
};

export type ResponseLpListDto = CursorBasedResponse<{
    data: Lp[];
}>;