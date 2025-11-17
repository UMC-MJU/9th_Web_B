import { useParams, useNavigate } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import { postLpComment } from "../apis/lp";
import { axiosInstance } from "../apis/axios";
import { useState, useEffect, useRef } from "react";
import CommentSkeleton from "../components/CommentSkeleton";

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [comment, setComment] = useState("");
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError, error, refetch } = useGetLpDetail(lpid || "");
  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentLoading,
    refetch: refetchComments,
  } = useGetLpComments(lpid || "", order);

  // 🔹 댓글 무한 스크롤
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  // 댓글 등록
  const handleSubmitComment = async () => {
    if (!comment.trim()) return alert("댓글을 입력해주세요.");
    try {
      await postLpComment(lpid!, comment);
      setComment("");
      refetchComments();
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  if (isLoading)
    return <div className="flex items-center justify-center min-h-screen text-gray-400">로딩 중...</div>;
  if (isError)
    return <div className="flex items-center justify-center min-h-screen text-red-500">데이터 불러오기 오류</div>;

  const lp = data;
  const comments = commentData?.pages.flatMap((p) => p.data.data) ?? [];

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* 기존 LP 상세 */}
        <img src={lp.thumbnail} alt={lp.title} className="w-full rounded-lg shadow-lg mb-8" />
        <h1 className="text-4xl font-bold mb-4">{lp.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
          <span>❤️ {lp.likes ?? 0}</span>
          <span>💬 {lp.comments ?? 0}</span>
          <span>👁 {lp.views ?? 0}</span>
        </div>
        <p className="leading-relaxed text-gray-200 mb-8 whitespace-pre-line">{lp.content}</p>

        {/* 댓글 정렬 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setOrder("desc")}
            className={`px-3 py-1 rounded-md text-sm border ${
              order === "desc" ? "bg-purple-600 border-purple-600" : "border-gray-600 hover:bg-gray-800"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setOrder("asc")}
            className={`ml-2 px-3 py-1 rounded-md text-sm border ${
              order === "asc" ? "bg-purple-600 border-purple-600" : "border-gray-600 hover:bg-gray-800"
            }`}
          >
            오래된순
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="bg-[#1e1e1e] rounded-lg p-4 space-y-4">
          {isCommentLoading ? (
            Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)
          ) : comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="border-b border-gray-700 pb-3">
                <div className="text-sm text-gray-400 mb-1">{c.author.name}</div>
                <div className="text-gray-200">{c.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">아직 댓글이 없습니다.</p>
          )}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={`fetch-${i}`} />)}
          <div ref={observerRef} className="h-6" />
        </div>

        {/* 댓글 작성 */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-[#1e1e1e] rounded-md px-4 py-3 text-gray-100 focus:ring-2 focus:ring-purple-600 outline-none"
          />
          <button
            onClick={handleSubmitComment}
            className="mt-3 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-md font-semibold"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
