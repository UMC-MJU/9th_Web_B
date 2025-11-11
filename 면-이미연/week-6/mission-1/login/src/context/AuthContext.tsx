import { createContext, useState, useContext } from "react";
import type { PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/keys";
import { postSignin, postLogout } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  nickname: string | null;
  login: (signlnData: RequestSigninDto) => Promise<void>;
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

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );
  const [nickname, setNickname] = useState<string | null>(
    getNicknameFromStorage()
  );

  const login = async (signinData: RequestSigninDto) => {
    try {
      const response = await postSignin(signinData);
      
      if (response.data) {
        const { 
          accessToken: newAccessToken, 
          refreshToken: newRefreshToken, 
          name 
        } = response.data;
        
        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);
        if (name) {
          setNicknameInStorage(name);
        }
        
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setNickname(name);
        
        alert("로그인 성공");
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인 실패");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      removeNicknameFromStorage();
      
      setAccessToken(null);
      setRefreshToken(null);
      setNickname(null);
      
      alert("로그아웃 성공");
    } catch (error) {
      console.log("로그아웃 오류", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, nickname, login, logout }}>
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