import { useEffect, useMemo, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getMyInfo();
                setData(res);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const displayName = useMemo(() => {
        const d = data?.data;
        const nick = (d as any)?.nickname?.trim?.() ?? "";
        const name = d?.name?.trim?.() ?? "";
        const email = d?.email ?? "";
        if (nick) return nick;
        if (name) return name;
        if (email.includes("@")) return email.split("@")[0];
        return "회원";
    }, [data]);

    const avatarPath = data?.data?.avatar ?? null;
    const avatarUrl =
        typeof avatarPath === "string" && avatarPath.length > 0
            ? avatarPath.startsWith("http")
                ? avatarPath
                : `${import.meta.env.VITE_SERVER_API_URL}${avatarPath}`
            : "";

    if (loading) {
        return (
            <section className="max-w-4xl mx-auto px-6 py-10">
                <div className="h-7 w-48 rounded bg-gray-700/50 animate-pulse mb-6" />
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gray-700/50 animate-pulse" />
                    <div className="space-y-3">
                        <div className="h-4 w-56 rounded bg-gray-700/50 animate-pulse" />
                        <div className="h-9 w-28 rounded bg-gray-700/50 animate-pulse" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-extrabold mb-6">{displayName}님, 반가워요.</h1>

            <div className="flex items-center gap-6">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="프로필 이미지"
                        className="w-20 h-20 rounded-full object-cover border border-gray-700"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                                "data:image/svg+xml;utf8,\
                                <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>\
                                <circle cx='40' cy='40' r='40' fill='%236b7280'/></svg>";
                        }}
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-700" />
                )}

                <div>
                    <p className="text-gray-300">{data?.data?.email ?? ""}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-3 bg-[#f72585] px-4 py-2 rounded-md text-white hover:brightness-90 cursor-pointer"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MyPage;