import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate: NavigateFunction = useNavigate();

    const { values, errors, touched, getInputProps } =
        useForm<UserSigninInformation>({
            initialValue: {
                email: "",
                password: "",
            },
            validate: validateSignin,
        });

    const handleSubmit = async () => {
        await login(values);
        navigate("/my");
    };

    const handleGoogleLogin = () => {
        window.location.href =
            import.meta.env.VITE_SERVER_API_URL + "/vq/auth/google/login";
    };

    // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼 비활성화
    const isDisabled: boolean =
        Object.values(errors || {}).some((error: string) => error.length > 0) ||
        Object.values(values).some((value: string) => value === "");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <div className="w-[320px] flex flex-col items-center gap-4">
                <h2 className="text-xl font-semibold mb-2">로그인</h2>

                {/* 구글 로그인 버튼 */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 w-full border border-gray-500 py-2 rounded-md hover:bg-gray-800 transition"
                >
                    <img
                        src="/google.png"
                        alt="Google Logo"
                        className="w-5 h-5"
                    />
                    구글 로그인
                </button>

                <div className="flex items-center w-full my-2">
                    <hr className="flex-1 border-gray-600" />
                    <span className="mx-3 text-gray-400 text-sm">OR</span>
                    <hr className="flex-1 border-gray-600" />
                </div>

                <input
                    {...getInputProps("email")}
                    type="email"
                    placeholder="이메일을 입력해주세요"
                    className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm text-white
                    focus:outline-none focus:border-[#807bff]
                    ${errors?.email && touched?.email
                            ? "border-red-500 bg-red-900/20"
                            : "border-gray-500"
                        }`}
                />
                {errors?.email && touched?.email && (
                    <p className="text-red-500 text-xs -mt-2">{errors.email}</p>
                )}

                <input
                    {...getInputProps("password")}
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm text-white
                    focus:outline-none focus:border-[#807bff]
                    ${errors?.password && touched?.password
                            ? "border-red-500 bg-red-900/20"
                            : "border-gray-500"
                        }`}
                />
                {errors?.password && touched?.password && (
                    <p className="text-red-500 text-xs -mt-2">{errors.password}</p>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full bg-gray-700 text-white py-2 rounded-md text-sm font-medium 
                    hover:bg-[#807bff] transition-colors 
                    disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
