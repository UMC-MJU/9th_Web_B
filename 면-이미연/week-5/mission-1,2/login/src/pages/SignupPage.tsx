import { useForm, type SubmitHandler, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";
import type { ResponseSignupDto } from "../types/auth";
import { Eye, EyeOff } from "lucide-react";

const schema = z
    .object({
        email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
        password: z
            .string()
            .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
            .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
        passwordCheck: z
            .string()
            .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
            .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
        name: z.string().min(1, { message: "이름을 입력해주세요." }),
    })
    .refine((data) => data.password === data.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"],
    });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [showPassword, setShowPassword] = useState({
        password: false,
        passwordCheck: false,
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormFields>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const watchEmail = useWatch({ control, name: "email" });
    const watchPassword = useWatch({ control, name: "password" });
    const watchPasswordCheck = useWatch({ control, name: "passwordCheck" });
    const watchName = useWatch({ control, name: "name" });

    const isStep1Valid = watchEmail && !errors.email;
    const isStep2Valid =
        watchPassword &&
        watchPasswordCheck &&
        !errors.password &&
        !errors.passwordCheck;
    const isStep3Valid = watchName && !errors.name;

    const togglePassword = (field: "password" | "passwordCheck") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const goBack = () => {
        if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { passwordCheck, ...rest } = data;

            const response: ResponseSignupDto = await postSignup(rest);
            console.log("회원가입 성공:", response);

            // 회원가입 성공 시 홈으로 이동
            navigate("/");
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <div className="w-[320px] flex flex-col items-center gap-4">
                <h2 className="text-xl font-semibold mb-2">회원가입</h2>

                {step === 1 && (
                    <>
                        <button className="flex items-center justify-center gap-2 w-full border border-gray-500 py-2 rounded-md hover:bg-gray-800 transition">
                            구글 로그인
                        </button>

                        <div className="flex items-center w-full my-2">
                            <hr className="flex-1 border-gray-600" />
                            <span className="mx-3 text-gray-400 text-sm">OR</span>
                            <hr className="flex-1 border-gray-600" />
                        </div>
                    </>
                )}

                {/* === 단계별 폼 === */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3 w-full"
                    noValidate
                >
                    {/* STEP 1: 이메일 */}
                    {step === 1 && (
                        <>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="이메일을 입력해주세요"
                                className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm text-white
                focus:outline-none  
                ${errors?.email
                                        ? "border-pink-500 bg-pink-900/20"
                                        : "border-gray-500"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-pink-500 text-xs -mt-2">
                                    {errors.email.message}
                                </p>
                            )}

                            <div className="flex gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={!isStep1Valid}
                                    className="flex-1 bg-pink-600 text-white py-2 rounded-md text-sm font-medium 
                            hover:bg-pink-700 transition-colors 
                            disabled:bg-gray-500 disabled:cursor-not-allowed"
                                >
                                    다음
                                </button>
                            </div>
                        </>
                    )}

                    {/* STEP 2: 비밀번호 / 비밀번호 확인 */}
                    {step === 2 && (
                        <>
                            <div className="relative w-full">
                                <input
                                    {...register("password")}
                                    type={showPassword.password ? "text" : "password"}
                                    placeholder="비밀번호를 입력해주세요"
                                    className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm text-white
                focus:outline-none  
                ${errors?.password
                                            ? "border-pink-500 bg-pink-900/20"
                                            : "border-gray-500"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword("password")}
                                    className="absolute right-3 top-2 text-gray-400"
                                >
                                    {showPassword.password ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-pink-500 text-xs -mt-2">
                                    {errors.password.message}
                                </p>
                            )}

                            <div className="relative w-full">
                                <input
                                    {...register("passwordCheck")}
                                    type={showPassword.passwordCheck ? "text" : "password"}
                                    placeholder="비밀번호를 다시 한 번 입력해주세요."
                                    className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm text-white
                focus:outline-none 
                ${errors?.passwordCheck
                                            ? "border-pink-500 bg-pink-900/20"
                                            : "border-gray-500"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword("passwordCheck")}
                                    className="absolute right-3 top-2 text-gray-400"
                                >
                                    {showPassword.passwordCheck ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {errors.passwordCheck && (
                                <p className="text-pink-500 text-xs -mt-2">
                                    {errors.passwordCheck.message}
                                </p>
                            )}

                            <div className="flex gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="flex-1 bg-gray-700 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    이전
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    disabled={!isStep2Valid}
                                    className="flex-1 bg-pink-600 text-white py-2 rounded-md text-sm font-medium 
                            hover:bg-pink-700 transition-colors 
                            disabled:bg-gray-500 disabled:cursor-not-allowed"
                                >
                                    다음
                                </button>
                            </div>
                        </>
                    )}

                    {/* STEP 3: 닉네임 */}
                    {step === 3 && (
                        <div className="flex flex-col items-center gap-4 mt-4">
                            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="gray"
                                    viewBox="0 0 24 24"
                                    width="60"
                                    height="60"
                                >
                                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                                </svg>
                            </div>

                            <input
                                {...register("name")}
                                type="text"
                                placeholder="닉네임을 입력해주세요"
                                className={`w-full px-3 py-2 border rounded-md bg-black text-sm text-white
                focus:outline-none text-center
                ${errors?.name
                                        ? "border-pink-500 bg-pink-900/20"
                                        : "border-gray-500"
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-pink-500 text-xs -mt-2">
                                    {errors.name.message}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={!isStep3Valid || isSubmitting}
                                className="w-full bg-pink-600 text-white py-2 rounded-md text-sm font-medium 
                        hover:bg-pink-700 transition-colors 
                        disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "처리 중..." : "회원가입 완료"}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignupPage;