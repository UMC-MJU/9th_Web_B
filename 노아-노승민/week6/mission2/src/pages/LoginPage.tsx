import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem("accessToken", "dummy_token_1234");
      alert("로그인 성공!");
      navigate(redirectPath); 
    } catch {
      alert("로그인 실패. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#121212] text-white">
      <h1 className="text-3xl font-bold mb-6">로그인</h1>
      <form
        onSubmit={handleLogin}
        className="bg-[#1e1e1e] p-6 rounded-lg shadow-md w-80 space-y-4"
      >
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
