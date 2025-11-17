import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../apis/axios";

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // 입력값 상태
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 유효성 검사
  const validateStep = () => {
    if (step === 1) {
      if (!email) return "이메일을 입력해주세요.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return "올바른 이메일 형식이 아닙니다.";
    }
    if (step === 2) {
      if (!password || !passwordCheck) return "비밀번호를 입력해주세요.";
      if (password.length < 8)
        return "비밀번호는 8자 이상이어야 합니다.";
      if (password !== passwordCheck)
        return "비밀번호가 일치하지 않습니다.";
    }
    if (step === 3) {
      if (!name.trim()) return "이름을 입력해주세요.";
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((prev) => prev + 1);
  };

  // 회원가입 요청
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
        bio: bio || null,
        avatar: avatar || null,
      });

      console.log(" 회원가입 성공:", response.data);

      if (response.data.status) {
        alert(" 회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        setError(response.data.message || "회원가입 실패");
      }
    } catch (err: any) {
      console.error("회원가입 에러:", err);
      setError(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#121212] text-gray-100 px-4">
      <div className="w-full max-w-md bg-[#181818] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">
          NOAH 회원가입
        </h1>

        {/* STEP 1: 이메일 */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="flex flex-col gap-5"
          >
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="bg-[#202020] border border-gray-700 py-3 rounded-lg hover:bg-[#2a2a2a] transition-all"
            >
              구글 계정으로 가입
            </button>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="flex-1 border-b border-gray-600" />
              <span>OR</span>
              <div className="flex-1 border-b border-gray-600" />
            </div>

            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#202020] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none text-gray-100"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all"
            >
              다음
            </button>
          </form>
        )}

        {/* STEP 2: 비밀번호 */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="flex flex-col gap-5"
          >
            <input
              type="password"
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#202020] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none text-gray-100"
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              className="bg-[#202020] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none text-gray-100"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-600 py-3 rounded-lg hover:bg-[#2a2a2a]"
              >
                이전
              </button>
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all"
              >
                다음
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: 이름, bio, 아바타 */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="이름 (필수)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#202020] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none text-gray-100"
            />
            <input
              type="text"
              placeholder="소개 (선택)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-[#202020] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none text-gray-100"
            />
            <input
              type="text"
              placeholder="프로필 이미지 URL (선택)"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="bg-[#202020] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none text-gray-100"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-600 py-3 rounded-lg hover:bg-[#2a2a2a]"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-lg text-white font-semibold transition-all ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {loading ? "가입 중..." : "회원가입 완료"}
              </button>
            </div>
          </form>
        )}

        {step < 3 && (
          <p className="text-sm text-gray-400 text-center mt-6">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-purple-400 hover:underline"
            >
              로그인
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
