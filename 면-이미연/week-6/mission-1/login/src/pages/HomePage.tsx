import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";

export default function LpListPage() {
    const [order, setOrder] = useState<"newest" | "oldest">("newest");
    const navigate = useNavigate();

    const apiOrder =
        order === "newest" ? PAGINATION_ORDER.DESC : PAGINATION_ORDER.ASC;

    const {
        data: lpList = [],
        isPending,
        isError,
        refetch,
    } = useGetLpList({
        cursor: 0,
        search: "",
        order: apiOrder,
        limit: 20,
    });

    if (isPending) {
        return (
            <div className="p-5 grid grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="aspect-square bg-gray-200 animate-pulse"
                    ></div>
                ))}
            </div>
        );
    }

    if (isError || lpList.length === 0) {
        return (
            <div className="p-5 text-center">
                <p className="text-red-500 mb-2">LP 목록을 불러오지 못했습니다.</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-pink-500 text-white rounded"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="p-5">
            {/* 정렬 버튼 */}
            <div className="flex justify-end gap-3 mb-6">
                <button
                    onClick={() => setOrder("oldest")}
                    className={`px-4 py-2 rounded ${order === "oldest"
                            ? "bg-pink-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                >
                    오래된순
                </button>
                <button
                    onClick={() => setOrder("newest")}
                    className={`px-4 py-2 rounded ${order === "newest"
                            ? "bg-pink-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                >
                    최신순
                </button>
            </div>

            {/* LP 카드 목록 */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {lpList.map((lp) => (
                    <div
                        key={lp.id}
                        onClick={() => navigate(`/lp/${lp.id}`)}
                        className="relative cursor-pointer overflow-hidden group"
                    >
                        <img
                            src={lp.thumbnail}
                            alt={lp.title}
                            className="w-full h-full object-cover aspect-square transform transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/fallback-image.png";
                            }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-white text-left p-3">
                            <h2 className="font-semibold text-base mb-1 truncate leading-snug">
                                {lp.title}
                            </h2>
                            <div className="flex justify-between items-center text-xs mt-1">
                                <p className="text-gray-300">
                                    {new Date(lp.createdAt).toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </p>
                                <p className="text-white font-medium">
                                    ❤️ {lp.likes?.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
