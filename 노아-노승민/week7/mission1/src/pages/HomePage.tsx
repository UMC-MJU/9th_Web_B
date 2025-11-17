import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enum/common";
import LpWriteModal from "../components/LpWriteModal"; 

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);


  const [isWriteOpen, setIsWriteOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetLpList({
    cursor: null,
    limit: 20,
    search,
    order,
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 px-6 py-8 relative">

      {/* 상단 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">LP STORE</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.DESC)}
            className={`px-4 py-2 rounded-md text-sm font-semibold border ${
              order === PAGINATION_ORDER.DESC
                ? "bg-purple-600 border-purple-600"
                : "border-gray-600 hover:bg-gray-800"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.ASC)}
            className={`px-4 py-2 rounded-md text-sm font-semibold border ${
              order === PAGINATION_ORDER.ASC
                ? "bg-purple-600 border-purple-600"
                : "border-gray-600 hover:bg-gray-800"
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {/* 검색 */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-8"
      >
        <input
          type="text"
          placeholder="앨범 제목 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1e1e1e] text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </form>

      {/* 로딩 */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg aspect-square" />
          ))}
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <p className="text-center text-red-500 mt-10">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
      )}

      {/* LP 리스트 */}
      {data?.pages && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.pages.flatMap((page) =>
            page.data?.data.map((lp: any) => {
              const likeCount =
                typeof lp.likes === "number"
                  ? lp.likes
                  : Array.isArray(lp.likes)
                  ? lp.likes.length
                  : typeof lp.likes === "object" && lp.likes !== null
                  ? 1
                  : 0;

              return (
                <div
                  key={lp.id}
                  onClick={() => navigate(`/lp/${lp.id}`)}
                  className="relative group overflow-hidden rounded-lg bg-[#1e1e1e] cursor-pointer hover:scale-[1.05] transition-transform duration-300"
                >
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="w-full h-full object-cover aspect-square group-hover:opacity-80 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 
                    bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <h2 className="font-semibold text-lg truncate">{lp.title}</h2>
                    <p className="text-xs text-gray-400">
                      {new Date(lp.createdAt).toLocaleDateString()}
                    </p>
                    <div className="text-sm text-gray-300 mt-1">
                      ❤️ {likeCount}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 추가 로딩 */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg aspect-square" />
          ))}
        </div>
      )}

      <div ref={observerRef} className="h-10" />


      <button
        type="button"
        onClick={() => setIsWriteOpen(true)}
        className="
          fixed bottom-8 right-8 
          w-14 h-14 rounded-full
          bg-purple-600 hover:bg-purple-700
          flex items-center justify-center
          text-3xl text-white
          shadow-xl
        "
      >
        +
      </button>


      <LpWriteModal
        isOpen={isWriteOpen}
        onClose={() => setIsWriteOpen(false)}
      />
    </div>
  );
}
