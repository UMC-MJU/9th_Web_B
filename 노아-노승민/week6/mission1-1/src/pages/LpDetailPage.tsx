import { useParams, useNavigate } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { axiosInstance } from "../apis/axios";
import { useState, useEffect } from "react";

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  console.log("LpDetailPage 렌더됨, lpid:", lpid);

  const { data, isLoading, isError, error, refetch } = useGetLpDetail(lpid || "");

  useEffect(() => {
    console.log("useGetLpDetail 상태", { isLoading, isError, data, error });
  }, [isLoading, isError, data, error]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        로딩 중...
      </div>
    );

  if (isError) {
    console.error(" 상세 데이터 에러:", error);
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  if (!data) {
    console.warn("데이터 없음:", data);
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-400">
        데이터가 없습니다.
      </div>
    );
  }

  const lp = data; 

  console.log("렌더링할 LP 데이터:", lp);

  const handleEdit = async () => {
    const newTitle = prompt("새 제목:", lp.title);
    const newContent = prompt("새 내용:", lp.content);
    if (!newTitle || !newContent) return;

    try {
      setLoading(true);
      const res = await axiosInstance.patch(`/lps/${lpid}`, {
        title: newTitle,
        content: newContent,
      });
      console.log("수정 응답:", res.data);
      alert("수정되었습니다!");
      refetch();
    } catch (err) {
      console.error("수정 오류:", err);
      alert("수정 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      setLoading(true);
      const res = await axiosInstance.delete(`/lps/${lpid}`);
      console.log(" 삭제 응답:", res.data);
      alert("삭제 완료");
      navigate("/");
    } catch (err) {
      console.error(" 삭제 오류:", err);
      alert("삭제 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/lps/${lpid}/likes`);
      console.log("❤️ 좋아요 응답:", res.data);
      refetch();
    } catch (err) {
      console.warn("💔 좋아요 실패 → 취소 요청 시도", err);
      await axiosInstance.delete(`/lps/${lpid}/likes`);
      refetch();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full rounded-lg shadow-lg mb-8"
        />

        <h1 className="text-4xl font-bold mb-4">{lp.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
          <span>❤️ {lp.likes ?? 0}</span>
          <span>💬 {lp.comments ?? 0}</span>
          <span>👁 {lp.views ?? 0}</span>
        </div>

        <p className="leading-relaxed text-gray-200 mb-8 whitespace-pre-line">
          {lp.content}
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleEdit}
            disabled={loading}
            className="px-5 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50"
          >
            수정
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
          >
            삭제
          </button>

          <button
            onClick={handleLike}
            disabled={loading}
            className="px-5 py-2 rounded-md bg-pink-600 hover:bg-pink-700 transition disabled:opacity-50"
          >
            좋아요 💗
          </button>
        </div>
      </div>
    </div>
  );
}
