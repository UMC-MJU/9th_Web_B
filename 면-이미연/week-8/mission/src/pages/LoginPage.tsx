import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export const LoginPage = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();

    // 이미 로그인되어 있을 때 마이페이지로 이동
    useEffect(() => {
        if (accessToken) navigate("/my");
    }, [navigate, accessToken]);

    // 로그인 mutation
    const { mutate: loginMutate, isPending } = useMutation({
        mutationFn: (credentials: UserSigninInformation) => login(credentials),
        onSuccess: () => {
            navigate("/");
        },
        onError: () => {
            alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        },
    });

    const { values, errors, touched, getInputProps } =
        useForm<UserSigninInformation>({
            initialValue: { email: "", password: "" },
            validate: validateSignin,
        });

    const errs = errors ?? {};
    const tch = touched ?? {};

    const handleSubmit = () => {
        loginMutate(values);
    };

    const handleGoogleLogin = () => {
        window.location.href =
            import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    };

    const isValid =
        !Object.values(errs).some((e) => (e?.length ?? 0) > 0) &&
        !Object.values(values).some((v) => v === "");

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <div className="flex-1 flex items-center justify-center">
                <div className="relative flex flex-col w-[380px] gap-5 items-center text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-3 top-2 text-2xl text-white hover:text-gray-300 transition-all"
                    >
                        &lt;
                    </button>

                    <h1 className="text-2xl font-bold mb-2">로그인</h1>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="relative flex items-center justify-center w-full border border-gray-400 rounded-md py-3 hover:bg-gray-800 transition-all"
                    >
                        <img
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                            alt="Google 로고"
                            className="absolute left-4 w-5 h-5"
                        />
                        <span className="text-sm">구글 로그인</span>
                    </button>

                    <div className="flex items-center w-full text-gray-400 text-xs gap-2 my-1">
                        <div className="flex-1 h-px bg-gray-600" />
                        <span>OR</span>
                        <div className="flex-1 h-px bg-gray-600" />
                    </div>

                    <input
                        {...getInputProps("email")}
                        className={`w-full bg-black text-white border rounded-md p-3 text-base placeholder-gray-400 ${tch.email && (errs.email?.length ?? 0) > 0
                                ? "border-red-500"
                                : "border-gray-500 focus:border-white"
                            }`}
                        type="email"
                        placeholder="이메일을 입력해주세요!"
                        autoComplete="off"
                        disabled={isPending}
                    />
                    {tch.email && (errs.email?.length ?? 0) > 0 && (
                        <p className="text-red-500 text-sm -mt-2">{errs.email}</p>
                    )}

                    <input
                        {...getInputProps("password")}
                        className={`w-full bg-black text-white border rounded-md p-3 text-base placeholder-gray-400 ${tch.password && (errs.password?.length ?? 0) > 0
                                ? "border-red-500"
                                : "border-gray-500 focus:border-white"
                            }`}
                        type="password"
                        placeholder="비밀번호를 입력해주세요!"
                        autoComplete="new-password"
                        disabled={isPending}
                    />
                    {tch.password && (errs.password?.length ?? 0) > 0 && (
                        <p className="text-red-500 text-sm -mt-2">
                            {errs.password}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || isPending}
                        className={`w-full py-3 rounded-md text-base font-semibold transition-all duration-200 ${isValid && !isPending
                                ? "bg-[#f72585] hover:brightness-90 cursor-pointer"
                                : "bg-[#141414] text-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {isPending ? "로그인 중..." : "로그인"}
                    </button>
                </div>
            </div>
        </div>
    );
};
