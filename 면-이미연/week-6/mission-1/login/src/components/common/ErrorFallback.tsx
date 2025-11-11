export default function ErrorFallback({ message }: { message?: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-gray-300">
            <div className="text-center space-y-3">
                <p className="text-2xl font-semibold text-[#f72585]">오류가 발생했습니다</p>
                <p className="text-sm text-gray-400">
                    {message || "데이터를 불러오는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요."}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-5 py-2 rounded-md bg-[#f72585] text-white text-sm hover:brightness-90 transition-all"
                >
                    새로고침
                </button>
            </div>
        </div>
    );
}