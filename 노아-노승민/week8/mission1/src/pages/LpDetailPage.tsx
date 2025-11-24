// src/pages/LpDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import {
  postLpComment,
  patchLpComment,
  deleteLpComment,
  deleteLp,
  likeLp,
  updateLp,
} from "../apis/lp";

import CommentSkeleton from "../components/CommentSkeleton";
import AlertModal from "../components/AlertModal";
import { useAuthStore } from "../store/useAuthStore";

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const lpIdNum = Number(lpid);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const nickname = useAuthStore((s) => s.nickname);

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [comment, setComment] = useState("");
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  /** 상세 조회 */
  const { data, isLoading, isError } = useGetLpDetail(lpid || "");

  /** 댓글 조회 */
  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentLoading,
  } = useGetLpComments(lpid || "", order);

  /** 무한스크롤 */
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  /** invalidate */
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
    queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
  };

  /** 댓글 생성 */
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => postLpComment(lpid!, content),
    onSuccess: () => {
      setComment("");
      invalidateAll();
    },
  });

  /** 댓글 수정 */
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      patchLpComment(lpid!, commentId, content),
    onSuccess: () => {
      setEditingId(null);
      setEditingContent("");
      invalidateAll();
    },
  });

  /** 댓글 삭제 */
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteLpComment(lpid!, commentId),
    onSuccess: () => invalidateAll(),
  });

  /** LP 삭제 */
  const deleteLpMutation = useMutation({
    mutationFn: () => deleteLp(lpIdNum),
    onSuccess: () => {
      alert("삭제 완료");
      navigate("/");
    },
  });


  const likeMutation = useMutation({
    mutationFn: () => likeLp(lpIdNum),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["lp", lpid] });

      const prevLp = queryClient.getQueryData<any>(["lp", lpid]);

      queryClient.setQueryData(["lp", lpid], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          likes: [...old.likes, { id: Date.now() }]
        };
      });

      return { prevLp };
    },

    onError: (_err, _new, ctx) => {
      if (ctx?.prevLp) queryClient.setQueryData(["lp", lpid], ctx.prevLp);
      alert("좋아요 실패");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });

  /** 제목 수정 */
  const updateTitleMutation = useMutation({
    mutationFn: (title: string) => updateLp(lpIdNum, { title }),
    onSuccess: () => {
      setIsEditingTitle(false);
      invalidateAll();
    },
  });

  /** 댓글 작성 핸들러 */
  const handleSubmitComment = () => {
    if (!comment.trim()) return alert("댓글을 입력해주세요.");
    createCommentMutation.mutate(comment.trim());
  };

  const handleDeleteLp = () => {
    deleteLpMutation.mutate();
    setIsDeleteModalOpen(false);
  };

  /** 댓글 flatten */
  const comments = commentData?.pages.flatMap((p) => p.data.data) ?? [];

  if (isLoading)
    return <div className="flex justify-center items-center h-screen text-gray-400">로딩 중…</div>;

  if (isError || !data)
    return <div className="flex justify-center items-center h-screen text-red-500">불러오기 실패</div>;

  const lp = data;
  const isMine = lp.author.name === nickname;

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <img src={lp.thumbnail} className="w-full rounded-lg shadow-lg mb-8" />

        {/* 제목·수정 */}
        <div className="flex justify-between items-start mb-4">
          {isEditingTitle ? (
            <div className="flex-1">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#111] text-3xl px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-purple-600"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="px-3 py-1 rounded-md border border-gray-600"
                >
                  취소
                </button>
                <button
                  onClick={() => updateTitleMutation.mutate(newTitle)}
                  className="px-3 py-1 bg-purple-600 rounded-md"
                >
                  완료
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold">{lp.title}</h1>

              {isMine && (
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => {
                      setIsEditingTitle(true);
                      setNewTitle(lp.title);
                    }}
                    className="text-gray-300"
                  >
                    ✏ 제목 수정
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-red-400"
                  >
                    🗑 삭제
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 작성자 정보 */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          <span>{lp.author.name}</span>
          <span>{new Date(lp.createdAt).toLocaleDateString()}</span>

          <button
            onClick={() => likeMutation.mutate()}
            className="flex items-center gap-1 hover:text-pink-400 transition"
          >
            ❤️ {lp.likes?.length ?? 0}
          </button>

          <span>💬 {lp.commentCount ?? comments.length}</span>
          <span>👁 {lp.views ?? 0}</span>
        </div>

        {/* 본문 */}
        <p className="leading-relaxed text-gray-200 whitespace-pre-line mb-8">
          {lp.content}
        </p>

        {/* 댓글 정렬 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setOrder("desc")}
            className={`px-3 py-1 rounded-md border ${
              order === "desc" ? "bg-purple-600" : "border-gray-600"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setOrder("asc")}
            className={`ml-2 px-3 py-1 rounded-md border ${
              order === "asc" ? "bg-purple-600" : "border-gray-600"
            }`}
          >
            오래된순
          </button>
        </div>

        {/* 댓글 리스트 */}
        <div className="bg-[#1e1e1e] p-4 rounded-lg space-y-4">
          {isCommentLoading ? (
            Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)
          ) : comments.length > 0 ? (
            comments.map((c) => {
              const mine = c.author.name === nickname;
              const editing = editingId === c.id;

              return (
                <div key={c.id} className="border-b border-gray-700 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm text-gray-400">{c.author.name}</div>

                    {mine && !editing && (
                      <button
                        className="text-gray-500 hover:text-gray-300 text-xl"
                        onClick={() => {
                          setEditingId(c.id);
                          setEditingContent(c.content);
                        }}
                      >
                        …
                      </button>
                    )}
                  </div>

                  {editing ? (
                    <div className="space-y-2">
                      <input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full bg-[#111] rounded-md px-3 py-2 text-gray-100"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingContent("");
                          }}
                          className="px-3 py-1 border border-gray-600 rounded-md"
                        >
                          취소
                        </button>
                        <button
                          onClick={() =>
                            updateCommentMutation.mutate({
                              commentId: c.id,
                              content: editingContent,
                            })
                          }
                          className="px-3 py-1 bg-purple-600 rounded-md text-white"
                        >
                          수정 완료
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-gray-200">{c.content}</div>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <span>{new Date(c.createdAt).toLocaleString()}</span>

                        {mine && (
                          <button
                            onClick={() => deleteCommentMutation.mutate(c.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm">아직 댓글이 없습니다.</p>
          )}

          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}

          <div ref={observerRef} className="h-6" />
        </div>

        {/* 댓글 작성 */}
        <div className="mt-6">
          <div className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 bg-[#1e1e1e] px-4 py-3 rounded-md focus:ring-2 focus:ring-purple-600"
            />

            <button
              onClick={handleSubmitComment}
              disabled={createCommentMutation.isPending}
              className="px-4 py-2 bg-purple-600 rounded-md"
            >
              {createCommentMutation.isPending ? "작성 중..." : "작성"}
            </button>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <AlertModal
          message="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          onConfirm={handleDeleteLp}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
