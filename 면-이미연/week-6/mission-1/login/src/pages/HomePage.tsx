import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import type { Lp } from "../types/lp";
import LoadingSpinner from "../components/common/LoadingFallback";
import ErrorFallback from "../components/common/ErrorFallback";

const HomePage = () => {
    const navigate = useNavigate();
    const { data: lps = [], isPending, isError, error } = useGetLpList({
        cursor: undefined,
        search: "",
        order: "desc",
        limit: 20,
    });

    if (isPending) return <LoadingSpinner />;
    if (isError) return <ErrorFallback message={(error as any)?.message} />;

    const isEmpty = lps.length === 0;

    return (
        <div className="max-w-7xl mx-auto py-8">
            {isEmpty ? (
                <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-300 mb-2">
                            아직 게시물이 없습니다
                        </h2>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {lps.map((lp: Lp) => (
                        <div
                            key={lp.id}
                            onClick={() => navigate(`/lp/${lp.id}`)}
                            className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer
                                        transform transition-all duration-300 hover:scale-105 
                                        hover:shadow-2xl hover:shadow-pink-500/50 group relative"
                        >
                            {/* 썸네일 */}
                            <div className="relative h-48 overflow-hidden">
                                {lp.thumbnail ? (
                                    <img
                                        src={
                                            lp.thumbnail.startsWith("http")
                                                ? lp.thumbnail
                                                : `${import.meta.env.VITE_SERVER_API_URL}${lp.thumbnail}`
                                        }
                                        alt={lp.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23374151'/><text x='50%' y='50%' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'>No Image</text></svg>";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}

                                {/* Hover 오버레이 */}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 
                                                transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                                        {lp.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm text-gray-300">
                                        <span>
                                            {lp.createdAt
                                                ? new Date(lp.createdAt).toLocaleDateString("ko-KR")
                                                : "날짜 없음"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            ❤️ {lp.likes?.length ?? 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 콘텐츠 */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold mb-2 line-clamp-1">
                                    {lp.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                    {lp.content}
                                </p>

                                {/* 작성자 & 좋아요 */}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    {lp.author && <span>by {lp.author.name}</span>}
                                    <span className="flex items-center gap-1">
                                        ❤️ {lp.likes?.length ?? 0}
                                    </span>
                                </div>

                                {/* 태그 */}
                                {lp.tags && lp.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {lp.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="text-xs bg-gray-800 text-pink-400 px-2 py-1 rounded"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;