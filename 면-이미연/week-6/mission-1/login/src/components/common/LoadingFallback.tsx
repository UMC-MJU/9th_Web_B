export default function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-gray-300">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-gray-700 border-t-[#f72585] rounded-full animate-spin" />
                <p className="text-sm text-gray-400 tracking-wide">LP 정보를 불러오는 중...</p>
            </div>
        </div>
    );
}
