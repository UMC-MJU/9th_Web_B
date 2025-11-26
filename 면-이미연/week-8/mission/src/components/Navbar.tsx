import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
    onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const navigate = useNavigate();
    const { accessToken, nickname, logout } = useAuth();

    const isLoggedIn = Boolean(accessToken);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-[#141414] text-white shadow-md z-50">
                <div className="flex justify-between items-center px-6 py-4">
                    {/* 왼쪽: 햄버거 + 로고 */}
                    <div className="flex items-center gap-3">
                        <button
                            className="p-2 hover:bg-gray-800 rounded lg:hidden"
                            onClick={onToggleSidebar}
                            aria-label="사이드바 열기/닫기"
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 48 48"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M7.95 11.95h32m-32 12h32m-32 12h32"
                                />
                            </svg>
                        </button>

                        <Link to="/" className="text-lg font-bold text-pink-500">
                            돌려돌려LP판
                        </Link>
                    </div>

                    {/* 오른쪽: 검색 + 로그인/회원가입 */}
                    <div className="flex items-center gap-4 text-sm">
                        {/* 🔍 검색 버튼 */}
                        <button
                            onClick={() => navigate("/search")}
                            className="p-2 hover:text-pink-400 transition"
                            aria-label="검색"
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

                        {isLoggedIn ? (
                            <>
                                <span className="hidden sm:block text-gray-300">
                                    {nickname || "사용자"}님 반갑습니다.
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-pink-400 transition"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-pink-400 transition">
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-pink-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-pink-600 transition"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
