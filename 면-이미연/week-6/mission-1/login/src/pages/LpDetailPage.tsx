import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Heart } from "lucide-react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingFallback";
import ErrorFallback from "../components/common/ErrorFallback";

const LpDetailPage = () => {
    const { lpId } = useParams<{ lpId: string }>();
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    const { data: lp, isPending, isError, error } = useGetLpDetail(Number(lpId));

    if (isPending) return <LoadingSpinner />;
    if (isError) return <ErrorFallback message={(error as any)?.message ?? "LP를 불러올 수 없습니다"} />;
    if (!lp) return <ErrorFallback message="LP를 찾을 수 없습니다" />;

    const isOwner = accessToken && lp.authorId; 
    const isLiked = false; 

    const handleEdit = () => {
        navigate(`/lp/${lpId}/edit`);
    };

    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            alert("삭제 기능 구현 필요");
        }
    };

    const handleLike = async () => {
        // TODO: 좋아요 API 호출
        alert("좋아요 기능 구현 필요");
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* 썸네일 섹션 */}
            <div className="mb-8">
                {lp.thumbnail ? (
                    <img
                        src={
                            lp.thumbnail.startsWith("http")
                                ? lp.thumbnail
                                : `${import.meta.env.VITE_SERVER_API_URL}${lp.thumbnail}`
                        }
                        alt={lp.title}
                        className="w-full max-h-[500px] object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23374151'/></svg>";
                        }}
                    />
                ) : (
                    <div className="w-full h-[300px] bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                        No Thumbnail
                    </div>
                )}
            </div>

            {/* 제목 & 메타 정보 섹션 */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold mb-4">{lp.title}</h1>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-4">
                        {lp.author && (
                            <div className="flex items-center gap-2">
                                {lp.author.avatar ? (
                                    <img
                                        src={lp.author.avatar}
                                        alt={lp.author.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-700" />
                                )}
                                <span className="font-medium text-white">{lp.author.name}</span>
                            </div>
                        )}
                        <span>
                            {lp.createdAt
                                ? new Date(lp.createdAt).toLocaleDateString("ko-KR", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  })
                                : "날짜 없음"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        <span>{lp.likes?.length ?? 0}</span>
                    </div>
                </div>

                {/* 태그 */}
                {lp.tags && lp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {lp.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="text-sm bg-gray-800 text-pink-400 px-3 py-1 rounded-full"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* 버튼 섹션 */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-800">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition
                              ${
                                  isLiked
                                      ? "bg-red-500 hover:bg-red-600"
                                      : "bg-gray-800 hover:bg-gray-700"
                              }`}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
                    좋아요
                </button>

                {isOwner && (
                    <>
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                                     rounded-md transition"
                        >
                            <Pencil className="w-4 h-4" />
                            수정
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 
                                     rounded-md transition"
                        >
                            <Trash2 className="w-4 h-4" />
                            삭제
                        </button>
                    </>
                )}
            </div>

            {/* 본문 섹션 */}
            <div className="prose prose-invert max-w-none">
                <div
                    className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: lp.content }}
                />
            </div>

            {/* 뒤로가기 버튼 */}
            <div className="mt-12 pt-6 border-t border-gray-800">
                <button
                    onClick={() => navigate("/")}
                    className="text-gray-400 hover:text-white transition"
                >
                    ← 목록으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default LpDetailPage;