import { createContext, useState, useContext } from "react";
import type { PropsWithChildren } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/keys";
import { postSignin, postLogout } from "../apis/auth";
import type { RequestSigninDto } from "../types/auth";
import { axiosInstance } from "../apis/axios";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    nickname: string | null;
    login: (signInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    nickname: null,
    login: async () => {},
    logout: async () => {},
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

    const {
        getItem: getNicknameFromStorage,
        setItem: setNicknameInStorage,
        removeItem: removeNicknameFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.nickname);

    const [accessToken, setAccessToken] = useState<string | null>(() => {
        const token = getAccessTokenFromStorage();
        if (token) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        return token;
    });

    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage()
    );

    const [nickname, setNickname] = useState<string | null>(
        getNicknameFromStorage()
    );

    const login = async (signinData: RequestSigninDto) => {
        try {
            const response = await postSignin(signinData);

            const raw = response.data as any;
            const payload = raw?.data ?? raw ?? {};

            const newAccessToken = payload.accessToken as string | undefined;
            const newRefreshToken = payload.refreshToken as string | undefined;
            const name = payload.name as string | undefined;

            if (!newAccessToken || !newRefreshToken) {
                console.error("Unexpected login response:", response.data);
                alert("로그인 응답 형식이 올바르지 않습니다.");
                return;
            }

            axiosInstance.defaults.headers.common["Authorization"] =
                `Bearer ${newAccessToken}`;

            setAccessTokenInStorage(newAccessToken);
            setRefreshTokenInStorage(newRefreshToken);
            if (name) {
                setNicknameInStorage(name);
            }

            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            setNickname(name ?? null);

            alert("로그인 성공");
        } catch (error) {
            console.error("로그인 오류:", error);
            delete axiosInstance.defaults.headers.common["Authorization"];
            alert("로그인 실패");
            throw error;
        }
    };

    const logout = async () => {
        try {
            await postLogout();
        } catch (_) {
        } finally {
            delete axiosInstance.defaults.headers.common["Authorization"];

            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            removeNicknameFromStorage();

            setAccessToken(null);
            setRefreshToken(null);
            setNickname(null);

            alert("로그아웃 성공");
        }
    };

    return (
        <AuthContext.Provider
            value={{ accessToken, refreshToken, nickname, login, logout }}
        >
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
