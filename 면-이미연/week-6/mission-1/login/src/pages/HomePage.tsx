import useGetLpList from "../hooks/queries/useGetLpList";
import type { Lp } from "../types/lp";

const HomePage = () => {
    const { data: lps = [], isPending, isError, error } = useGetLpList({} as any);

    if (isPending) return <div className="mt-20">Loading...</div>;
    if (isError) return <div className="mt-20">Error: {(error as any)?.message ?? ""}</div>;
    if (!Array.isArray(lps)) return <div className="mt-20">Unexpected data</div>;

    const isEmpty = lps.length === 0;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-6 p-6">
            {isEmpty ? (
                <h1 className="text-3xl font-bold text-gray-300">데이터를 불러오는 중입니다...</h1>
            ) : (
                lps.map((lp: Lp) => <h1 key={lp.id}>{lp.title}</h1>)
            )}
        </div>
    );
};

export default HomePage;