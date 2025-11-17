import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../apis/lp";
import { QUERY_KEY } from "../constants/keys";
import type { Lp, ResponseLpListDto } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";
import { useDebounce } from "../hooks/queries/useDebounce";
import { useThrottle } from "../hooks/queries/useThrottle";

const LIMIT = 12;
const RECENT_SEARCH_KEY = "recentSearches";

const loadRecentSearches = (): string[] => {
    try {
        const raw = localStorage.getItem(RECENT_SEARCH_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((v) => typeof v === "string");
    } catch {
        return [];
    }
};

const saveRecentSearch = (keyword: string) => {
    const value = keyword.trim();
    if (!value) return;
    const list = loadRecentSearches();
    const newList = [value, ...list.filter((item) => item !== value)].slice(0, 10);
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(newList));
};

const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCH_KEY);
};

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [order, setOrder] = useState<"newest" | "oldest">("newest");
    const [recent, setRecent] = useState<string[]>(() => loadRecentSearches());
    const [scrollY, setScrollY] = useState(0);

    const debouncedQuery = useDebounce(query, 300);
    const throttledScrollY = useThrottle(scrollY, 1000);

    const apiOrder =
        order === "newest" ? PAGINATION_ORDER.DESC : PAGINATION_ORDER.ASC;

    const enabled = debouncedQuery.trim().length > 0;

    const {
        data,
        isPending,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEY.search, debouncedQuery, apiOrder],
        queryFn: ({ pageParam = 0 }) =>
            getLpList({
                cursor: pageParam,
                search: debouncedQuery,
                order: apiOrder,
                limit: LIMIT,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage: ResponseLpListDto) =>
            lastPage.data.nextCursor ?? undefined,
        enabled,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    const lps: Lp[] =
        data?.pages.flatMap((page) => page.data.data ?? []) ?? [];

    useEffect(() => {
        if (!enabled) return;
        if (isPending) return;
        if (!debouncedQuery.trim()) return;

        saveRecentSearch(debouncedQuery.trim());
        setRecent(loadRecentSearches());
    }, [enabled, isPending, debouncedQuery]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.documentElement.scrollHeight - 400;

        if (scrollPosition >= threshold) {
            console.log("throttled scroll -> fetchNextPage");
            fetchNextPage();
        }
    }, [throttledScrollY, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleClickRecent = (keyword: string) => {
        setQuery(keyword);
    };

    const handleClearRecent = () => {
        clearRecentSearches();
        setRecent([]);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                🔍
                            </span>
                            <input
                                value={query}
                                onChange={handleChangeQuery}
                                placeholder="검색어를 입력하세요"
                                className="w-full bg-[#111] border border-gray-700 rounded px-9 py-2 text-sm focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        <select
                            value={order}
                            onChange={(e) =>
                                setOrder(e.target.value as "newest" | "oldest")
                            }
                            className="bg-[#111] border border-gray-700 rounded px-3 py-2 text-sm"
                        >
                            <option value="newest">최신순</option>
                            <option value="oldest">오래된순</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>최근 검색어</span>
                        {recent.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClearRecent}
                                className="text-[10px] hover:text-white"
                            >
                                모두 지우기
                            </button>
                        )}
                    </div>

                    {recent.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs">
                            {recent.map((keyword) => (
                                <button
                                    key={keyword}
                                    type="button"
                                    onClick={() => handleClickRecent(keyword)}
                                    className="px-2 py-1 rounded-full bg-[#1a1a1a] hover:bg-[#222] border border-gray-700"
                                >
                                    {keyword}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {query.trim().length === 0 && (
                    <p className="text-sm text-gray-500">검색어를 입력해 주세요.</p>
                )}

                {enabled && isPending && (
                    <p className="text-sm text-gray-400">검색 중...</p>
                )}

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {lps.map((lp) => (
                        <div
                            key={lp.id}
                            className="aspect-square bg-[#111] rounded overflow-hidden"
                        >
                            <img
                                src={lp.thumbnail}
                                alt={lp.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {enabled && !isPending && lps.length === 0 && (
                    <p className="mt-6 text-sm text-gray-400">검색 결과가 없습니다.</p>
                )}

                {hasNextPage && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="px-4 py-2 rounded bg-gray-200 text-black text-sm disabled:opacity-60"
                        >
                            {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
