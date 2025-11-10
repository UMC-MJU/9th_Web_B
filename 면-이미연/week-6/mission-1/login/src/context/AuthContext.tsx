import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/keys";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signinData: RequestSigninDto) => Promise<string | false>;
    logout: (opts?: { silent?: boolean }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => false,
    logout: async () => { },
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());

    const login = async (signinData: RequestSigninDto): Promise<string | false> => {
        try {
            const { data } = await postSignin(signinData);

            const newAccessToken =
                (data as any)?.data?.accessToken ?? (data as any)?.accessToken ?? null;
            const newRefreshToken =
                (data as any)?.data?.refreshToken ?? (data as any)?.refreshToken ?? null;

            if (!newAccessToken || !newRefreshToken) {
                console.error("토큰 파싱 실패:", data);
                alert("로그인 응답 형식이 올바르지 않습니다.");
                return false;
            }

            setAccessTokenInStorage(newAccessToken);
            setRefreshTokenInStorage(newRefreshToken);
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            alert("로그인 성공");

            const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/my";
            sessionStorage.removeItem("redirectAfterLogin");
            return redirectPath;
        } catch (error) {
            console.error("로그인 오류", error);
            alert("로그인 실패");
            return false;
        }
    };

    const logout = async (opts?: { silent?: boolean }) => {
        try {
            await postLogout().catch(() => { }); // 서버 실패 무시
        } finally {
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            setAccessToken(null);
            setRefreshToken(null);
            if (!opts?.silent) {
                alert("로그아웃 되었습니다.");
            }
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context;
};
