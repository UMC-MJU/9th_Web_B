import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm.ts";
import { type UserSigninInformation, validateSignin } from "../utils/validate";

const LoginPage = () => {
    const navigate = useNavigate();
    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: { email: "", password: "" },
        validate: validateSignin,
    });

    const handleSubmit = () => {
        console.log(values);
    };

    const isDisabled: boolean =
        Object.values(errors || {}).some(Boolean) ||
        Object.values(values).some((value) => value === "");

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-gray-200 p-4">
            <div className="relative w-full max-w-sm p-8 space-y-6 bg-gray-900/50 border border-gray-700 rounded-2xl">
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="absolute top-8 left-8 p-2 text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-white">
                        로그인
                    </h1>
                </div>
                <div className="space-y-4">
                    <div>
                        <input
                            {...getInputProps("email")}
                            name="email"
                            className={`w-full p-3 bg-transparent border rounded-full transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                errors?.email && touched?.email
                                    ? "border-red-500"
                                    : "border-gray-600"
                            }`}
                            type={"email"}
                            placeholder={"이메일을 입력해주세요"}
                        />
                        {errors?.email && touched?.email && (
                            <div className="mt-1.5 text-xs text-red-500 pl-4">{errors.email}</div>
                        )}
                    </div>
                    <div>
                        <input
                            {...getInputProps("password")}
                            name="password"
                            className={`w-full p-3 bg-transparent border rounded-full transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                errors?.password && touched?.password
                                    ? "border-red-500"
                                    : "border-gray-600"
                            }`}
                            type={"password"}
                            placeholder={"비밀번호를 입력해주세요"}
                        />
                        {errors?.password && touched?.password && (
                            <div className="mt-1.5 text-xs text-red-500 pl-4">{errors.password}</div>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full py-3 font-semibold transition-colors rounded-full disabled:border disabled:border-gray-600 disabled:text-gray-600 enabled:bg-gray-200 enabled:text-black enabled:hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white"
                >
                    로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;