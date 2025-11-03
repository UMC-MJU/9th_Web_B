import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/keys";         
import { useLocalStorage } from "../hooks/useLocalStorage";    

const GoogleLoginRedirectPage = () => {
    const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);  
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);  

        if (accessToken) {
            setAccessToken(accessToken);
            if (refreshToken) setRefreshToken(refreshToken);
            window.location.replace("/my");
        }
    }, [setAccessToken, setRefreshToken]);

    return <div>구글 로그인 리다이렉트 화면</div>;
};

export default GoogleLoginRedirectPage;
