import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Edit3, Trash2, Check, X } from "lucide-react";
import { QUERY_KEY } from "../../constants/keys";
import { useGetMyInfo } from "../../hooks/queries/useGetMyInfo";
import useGetLpCommentsInfinite from "../../hooks/queries/useGetLpCommentInfinite";
import { deleteLpComment, patchLpComment, postLpComment } from "../../apis/comment";
import type { Comment } from "../../types/common";

type Order = "asc" | "desc";

type Props = {
    lpId: number;
};

const LpCommentSection = ({ lpId }: Props) => {
    const [order, setOrder] = useState<Order>("asc");
    const [newContent, setNewContent] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const queryClient = useQueryClient();
    const { data: myInfo } = useGetMyInfo();

    const {
        data,
        isPending,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useGetLpCommentsInfinite({ lpId, order });

    const comments: Comment[] =
        data?.pages.flatMap((page) => page.data ?? []) ?? [];

    const myUserId = myInfo?.data?.id;

    const invalidateComments = () => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.lpComments, lpId],
        });
        refetch();
    };

    const createMutation = useMutation({
        mutationFn: (content: string) =>
            postLpComment({ lpId, content }),
        onSuccess: () => {
            setNewContent("");
            invalidateComments();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (vars: { commentId: number; content: string }) =>
            patchLpComment({
                lpId,
                commentId: vars.commentId,
                content: vars.content,
            }),
        onSuccess: () => {
            setEditingId(null);
            setEditingContent("");
            invalidateComments();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (commentId: number) =>
            deleteLpComment({ lpId, commentId }),
        onSuccess: () => {
            invalidateComments();
        },
    });

    const handleSubmit = () => {
        const value = newContent.trim();
        if (!value || createMutation.isPending) return;
        createMutation.mutate(value);
    };

    const handleStartEdit = (comment: Comment) => {
        setEditingId(comment.id);
        setEditingContent(comment.content);
        setOpenMenuId(null);
    };

    const handleConfirmEdit = () => {
        if (editingId === null) return;
        const value = editingContent.trim();
        if (!value || updateMutation.isPending) return;
        updateMutation.mutate({ commentId: editingId, content: value });
    };

    const handleDelete = (commentId: number) => {
        if (deleteMutation.isPending) return;
        deleteMutation.mutate(commentId);
        setOpenMenuId(null);
    };

    const handleChangeOrder = (nextOrder: Order) => {
        if (order === nextOrder) return;
        setOrder(nextOrder);
    };

    const isInitialLoading = isPending && !data;
    const isEmpty = !isInitialLoading && comments.length === 0;

    return (
        <section className="mt-8 rounded-xl bg-[#1c1c1c] p-4 text-sm text-white">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">댓글</h3>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => handleChangeOrder("asc")}
                        className={`rounded-md px-3 py-1 text-xs ${
                            order === "asc"
                                ? "bg-gray-300 text-black"
                                : "bg-[#2b2b2b] text-gray-300"
                        }`}
                    >
                        오래된순
                    </button>
                    <button
                        type="button"
                        onClick={() => handleChangeOrder("desc")}
                        className={`rounded-md px-3 py-1 text-xs ${
                            order === "desc"
                                ? "bg-gray-300 text-black"
                                : "bg-[#2b2b2b] text-gray-300"
                        }`}
                    >
                        최신순
                    </button>
                </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
                <input
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="댓글을 입력해주세요"
                    className="h-10 flex-1 rounded-md border border-gray-700 bg-[#141414] px-3 text-sm outline-none focus:border-gray-400"
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!newContent.trim() || createMutation.isPending}
                    className="h-10 rounded-md bg-gray-500 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-700"
                >
                    작성
                </button>
            </div>

            {isInitialLoading && (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-lg bg-[#141414] p-3"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-gray-700" />
                                <div className="h-3 w-24 rounded bg-gray-700" />
                            </div>
                            <div className="h-3 w-3/4 rounded bg-gray-700" />
                        </div>
                    ))}
                </div>
            )}

            {isError && (
                <p className="text-sm text-red-400">
                    {(error as any)?.message ??
                        "댓글을 불러오지 못했습니다."}
                </p>
            )}

            {!isInitialLoading && isEmpty && (
                <p className="py-4 text-center text-xs text-gray-400">
                    아직 댓글이 없습니다.
                </p>
            )}

            <ul className="space-y-3">
                {comments.map((comment) => {
                    const isMine = myUserId === comment.authorId;
                    const isEditing = editingId === comment.id;

                    const authorName = comment.author?.name ?? "알 수 없음";
                    const authorInitial = authorName.slice(0, 1);
                    const createdAtText = comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString()
                        : "";

                    return (
                        <li
                            key={comment.id}
                            className="rounded-lg bg-[#141414] p-3"
                        >
                            <div className="mb-1 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold">
                                        {authorInitial}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium">
                                            {authorName}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {createdAtText}
                                        </span>
                                    </div>
                                </div>

                                {isMine && (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenMenuId((prev) =>
                                                    prev === comment.id
                                                        ? null
                                                        : comment.id
                                                )
                                            }
                                            className="rounded p-1 hover:bg-gray-800"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                        {openMenuId === comment.id && (
                                            <div className="absolute right-0 mt-1 w-28 rounded-md bg-[#2b2b2b] text-xs shadow-lg">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStartEdit(comment)
                                                    }
                                                    className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-700"
                                                >
                                                    <Edit3 size={14} />
                                                    <span>수정</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(comment.id)
                                                    }
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-red-300 hover:bg-gray-700"
                                                >
                                                    <Trash2 size={14} />
                                                    <span>삭제</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="mt-2 flex items-center gap-2">
                                    <input
                                        value={editingContent}
                                        onChange={(e) =>
                                            setEditingContent(e.target.value)
                                        }
                                        className="h-9 flex-1 rounded-md border border-gray-700 bg-[#111111] px-2 text-sm outline-none focus:border-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleConfirmEdit}
                                        disabled={
                                            !editingContent.trim() ||
                                            updateMutation.isPending
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-500 disabled:cursor-not-allowed disabled:bg-gray-700"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditingContent("");
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <p className="mt-1 text-sm text-gray-100">
                                    {comment.content}
                                </p>
                            )}
                        </li>
                    );
                })}
            </ul>

            {hasNextPage && (
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="rounded-md bg-[#2b2b2b] px-4 py-2 text-xs text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
                    </button>
                </div>
            )}

            {isFetchingNextPage && (
                <div className="mt-3 space-y-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-lg bg-[#141414] p-3"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-gray-700" />
                                <div className="h-3 w-20 rounded bg-gray-700" />
                            </div>
                            <div className="h-3 w-2/3 rounded bg-gray-700" />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default LpCommentSection;
