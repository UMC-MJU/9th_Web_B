
import { useState } from "react";
import useLogin from "../hooks/mutations/useLogin";

export default function LoginPage() {
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#121212] text-white">
      <h1 className="text-3xl font-bold mb-6">로그인</h1>

      <form onSubmit={handleLogin} className="bg-[#1e1e1e] p-6 rounded-lg w-80 space-y-4">
        <input
          type="text"
          placeholder="이메일"
          className="w-full px-3 py-2 rounded-md bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          className="w-full px-3 py-2 rounded-md bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
