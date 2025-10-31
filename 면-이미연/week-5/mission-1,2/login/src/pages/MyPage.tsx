import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth.ts";
import type { ResponseMyInfoDto } from "../types/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate, type NavigateFunction } from "react-router-dom";

const MyPage = () => {
    const navigate: NavigateFunction = useNavigate();
    const { logout } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);

    useEffect(() => {
        const getData = async () => {
            const response: ResponseMyInfoDto = await getMyInfo();
            console.log(response);
            setData(response);
        };
        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>{data?.data?.name}님 환영합니다.</h1>
            <img src={data?.data?.avatar as string} alt={"구글 로고"} />
            <h1>{data?.data?.email}</h1>

            <button
                onClick={handleLogout}
                className="w-[320px] bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
                로그아웃
            </button>
        </div>
    );
};

export default MyPage;

