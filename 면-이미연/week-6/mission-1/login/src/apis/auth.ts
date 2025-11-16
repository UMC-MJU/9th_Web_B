import { axiosInstance } from "./axios";
import type {
    RequestSigninDto,
    RequestSignupDto,
    ResponseSigninDto,
    ResponseMyInfoDto,
    ResponseSignupDto,
} from "../types/auth";

// 회원가입
export const postSignup = async (
    body: RequestSignupDto
): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post<ResponseSignupDto>(
        "/v1/auth/signup",
        body
    );
    return data;
};

// 로그인
export const postSignin = async (
    body: RequestSigninDto
): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post<ResponseSigninDto>(
        "/v1/auth/signin",
        body
    );
    return data;
};

// 내 정보 조회
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.get<ResponseMyInfoDto>("/v1/users/me");
    return data;
};

// 내 정보 수정
export const updateMyInfo = async (
    formData: FormData
): Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.patch<ResponseMyInfoDto>(
        "/v1/users",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return data;
};

// 로그아웃
export const postLogout = async (): Promise<void> => {
    await axiosInstance.post("/v1/auth/signout");
};

// 회원 탈퇴
export const withdrawApi = async (): Promise<void> => {
    await axiosInstance.delete("/v1/users");
}
