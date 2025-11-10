import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";

const NAV_HEIGHT = 64;

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profile, setProfile] = useState<ResponseMyInfoDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { accessToken, logout } = useAuth();

    const toggleSidebar = () => setIsSidebarOpen((v) => !v);
    const closeSidebar = () => setIsSidebarOpen(false);

    useEffect(() => {
        let ignore = false;
        const fetchMe = async () => {
            if (!accessToken) {
                setProfile(null);
                return;
            }
            try {
                setIsLoading(true);
                const res = await getMyInfo();
                if (!ignore) setProfile(res);
            } catch (err) {
                try {
                    await logout();
                } finally {
                    navigate("/");
                }
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };
        fetchMe();
        return () => {
            ignore = true;
        };
    }, [accessToken, logout, navigate]);

    const displayName = useMemo(() => {
        const data = profile?.data as any;
        const nick = data?.nickname?.trim?.();
        const name = data?.name?.trim?.();
        const email: string | undefined = data?.email;
        if (nick) return nick;
        if (name) return name;
        if (email && email.includes("@")) return email.split("@")[0];
        return "사용자";
    }, [profile]);

    const onLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-[#0D1117] text-white shadow-md z-50">
                <header className="flex items-center justify-between px-6 py-4 bg-gray-900">
                    {/* 왼쪽: 햄버거 + 로고 */}
                    <div className="flex items-center gap-3">
                        {/* 햄버거 버튼 */}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-gray-800 rounded"
                            aria-label="메뉴 열기/닫기"
                            aria-expanded={isSidebarOpen}
                            aria-controls="app-sidebar"
                            type="button"
                        >
                            <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                    d="M7.95 11.95h32m-32 12h32m-32 12h32"
                                />
                            </svg>
                        </button>

                        <Link to="/" className="text-lg font-bold text-pink-500">
                            돌려돌려LP판
                        </Link>
                    </div>

                    {/* 오른쪽: 로그인 / 회원가입 */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/search")}
                            className="p-2 hover:bg-gray-800 rounded"
                            aria-label="검색으로 이동"
                            type="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>
                        </button>

                        {accessToken ? (
                            <>
                                <span className="hidden sm:block text-sm md:text-base text-gray-300 min-w-24 text-right">
                                    {isLoading ? "로딩중..." : `${displayName}님 반갑습니다.`}
                                </span>
                                <button
                                    onClick={onLogout}
                                    className="text-white hover:text-pink-400 transition"
                                    type="button"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-white hover:text-pink-400 transition">
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-pink-500 text-white px-4 py-1.5 rounded-full font-medium hover:bg-pink-600 transition"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </header>
            </nav>
            <div style={{ height: NAV_HEIGHT }} />
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </>
    );
};

export default Navbar;
