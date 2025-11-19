import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postSignup, postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/keys";

const SignupSchema = z
    .object({
        email: z.string().email("올바른 이메일 형식을 입력해주세요."),
        password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
        passwordCheck: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
        name: z.string().min(1, "닉네임을 입력해주세요."),
    })
    .refine((d) => d.password === d.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"],
    });

type SignupForm = z.infer<typeof SignupSchema>;

export const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [showPw, setShowPw] = useState(false);
    const [showPwCheck, setShowPwCheck] = useState(false);

    const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const {
        register,
        handleSubmit,
        trigger,
        getValues,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(SignupSchema),
        mode: "onChange",
        defaultValues: { email: "", password: "", passwordCheck: "", name: "" },
    });

    // 입력 값 실시간 구독
    const email = watch("email");
    const pw = watch("password");
    const pwc = watch("passwordCheck");
    const name = watch("name");

    // 비밀번호 불일치 즉시 표시 (둘 다 최소 길이 충족할 때만)
    useEffect(() => {
        if (pw?.length >= 6 && pwc?.length >= 6) {
            if (pw !== pwc) {
                setError("passwordCheck", {
                    type: "validate",
                    message: "비밀번호가 일치하지 않습니다.",
                });
            } else {
                clearErrors("passwordCheck");
            }
        } else {
            // 길이 유효성은 zod가 처리하므로 여기서 별도 오류 주입 X
            // (기존 길이 오류 메시지가 있다면 그대로 남게 됨)
        }
    }, [pw, pwc, setError, clearErrors]);

    // 이메일 → 비밀번호
    const goNextFromEmail = async () => {
        const ok = await trigger("email");
        if (ok) setStep(2);
    };

    // 비밀번호 → 닉네임
    const goNextFromPassword = async () => {
        // zod 모든 규칙(길이 + refine) 검증
        const ok = await trigger(["password", "passwordCheck"], {
            shouldFocus: true,
        });
        if (!ok) return;

        // 안전망: 혹시 모를 불일치 수동 체크
        const { password, passwordCheck } = getValues();
        if (password !== passwordCheck) {
            setError("passwordCheck", {
                type: "validate",
                message: "비밀번호가 일치하지 않습니다.",
            });
            return;
        }
        setStep(3);
    };

    // 최종 제출
    const onSubmit = async (data: SignupForm) => {
        const { email, password, name } = data;
        await postSignup({ email, password, name });
        const signInRes = await postSignin({ email, password });
        setItem(signInRes.data.accessToken);
        navigate("/");
    };

    // 버튼 활성화 조건
    const emailOk = !!email && !errors.email;
    const pwOk =
        pw?.length >= 6 &&
        pwc?.length >= 6 &&
        pw === pwc &&
        !errors.password &&
        !errors.passwordCheck;
    const nameOk = !!name && !errors.name;

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative px-6">
            <div className="relative flex flex-col w-[380px] gap-5 items-center text-center bg-transparent">
                {/* 뒤로가기 버튼 */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-3 top-2 text-2xl text-white cursor-pointer hover:text-gray-300 hover:brightness-90 transition-all duration-150"
                >
                    &lt;
                </button>

                <h1 className="text-2xl font-bold mb-2">회원가입</h1>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm flex flex-col space-y-5 items-center"
            >
                {step === 1 && (
                    <>
                        {/* 구글 로그인 버튼 */}
                        <button
                            type="button"
                            className="relative flex items-center justify-center w-full border border-gray-500 rounded-md py-3 hover:bg-gray-800 transition-all cursor-pointer"
                        >
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                                alt="Google 로고"
                                className="absolute left-4 w-5 h-5"
                            />
                            <span className="text-sm font-medium">구글 로그인</span>
                        </button>

                        {/* OR 구분선 */}
                        <div className="flex items-center w-full text-gray-400 text-xs gap-2">
                            <div className="flex-1 h-px bg-gray-700" />
                            <span>OR</span>
                            <div className="flex-1 h-px bg-gray-700" />
                        </div>

                        {/* 이메일 입력 */}
                        <div className="w-full">
                            <input
                                type="email"
                                placeholder="이메일을 입력해주세요!"
                                {...register("email")}
                                className="w-full px-4 py-3 rounded-md bg-[#141414] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f72585]"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={goNextFromEmail}
                            disabled={!emailOk}
                            className={`w-full py-3 rounded-md text-base font-semibold transition-all ${emailOk
                                    ? "bg-[#f72585] hover:brightness-90 cursor-pointer"
                                    : "bg-[#141414] text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            다음
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="relative w-full">
                            <input
                                type={showPw ? "text" : "password"}
                                placeholder="비밀번호를 입력해주세요!"
                                {...register("password")}
                                className="w-full px-4 py-3 rounded-md bg-[#141414] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f72585]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-white"
                            >
                                {showPw ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="relative w-full">
                            <input
                                type={showPwCheck ? "text" : "password"}
                                placeholder="비밀번호를 다시 입력해주세요!"
                                {...register("passwordCheck")}
                                className="w-full px-4 py-3 rounded-md bg-[#141414] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f72585]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwCheck((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-white"
                            >
                                {showPwCheck ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.passwordCheck && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.passwordCheck.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={goNextFromPassword}
                            disabled={!pwOk}
                            className={`w-full py-3 rounded-md text-base font-semibold transition-all ${pwOk
                                    ? "bg-[#f72585] hover:brightness-90 cursor-pointer"
                                    : "bg-[#141414] text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            다음
                        </button>
                    </>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center gap-6 w-full">
                        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                alt="기본 프로필"
                                className="w-16 h-16 opacity-80"
                            />
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="닉네임을 입력해주세요!"
                                {...register("name")}
                                className="w-full px-4 py-3 rounded-md bg-[#141414] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f72585] text-center"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!nameOk}
                            className={`w-full py-3 rounded-md text-base font-semibold transition-all ${nameOk
                                    ? "bg-[#f72585] hover:brightness-90 cursor-pointer"
                                    : "bg-[#141414] text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            회원가입 완료
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};