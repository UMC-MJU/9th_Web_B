import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import useLogout from "../hooks/mutations/useLogout";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { isLoggedIn, nickname } = useAuthStore();
  const { mutate: logoutMutation } = useLogout();

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-black border-b border-gray-800 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-purple-400 hover:text-fuchsia-400 transition w-8 h-8 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          >
            <path d="M7.95 11.95h32m-32 12h32m-32 12h32" />
          </svg>
        </button>

        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent cursor-pointer tracking-wide">
          NOAH
        </h1>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium">
        {isLoggedIn ? (
          <>
            <span className="text-gray-300">{nickname}님 반갑습니다.</span>
            <button
              onClick={() => logoutMutation()}
              className="text-gray-400 hover:text-fuchsia-400 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-fuchsia-400 transition">
              로그인
            </Link>
            <Link to="/signup" className="text-gray-300 hover:text-fuchsia-400 transition">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
