import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect, useMemo } from "react";

const ProtectedLayout = () => {
    const { accessToken } = useAuth(); 
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const isAuthRedirect = useMemo(() => {
        const p = location.pathname;
        return (
            p.includes("/google") ||
            p.includes("/google-login-redirect") ||
            p.includes("/v1/auth/google/callback")
        );
    }, [location.pathname]);

    useEffect(() => {
        const fullPath = `${location.pathname}${location.search}${location.hash}`;

        if (!accessToken && !isAuthRedirect && location.pathname !== "/login") {
            sessionStorage.setItem("redirectAfterLogin", fullPath);
            setShowModal(true);
        } else if (accessToken) {
            setShowModal(false);
        }
    }, [accessToken, isAuthRedirect, location.pathname, location.search, location.hash]);

    const handleConfirm = () => {
        setShowModal(false);
        setRedirectToLogin(true);
    };

    if (!accessToken && redirectToLogin) {
        return <Navigate to="/login" replace />;
    }

    if (!accessToken && showModal) {
        return (
            <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60">
                <div className="w-full max-w-sm mx-4 rounded-xl border border-neutral-800 bg-[#141414] p-6 shadow-2xl">
                    <h2 className="mb-3 text-xl font-bold text-white">로그인이 필요합니다</h2>
                    <p className="mb-6 text-sm leading-6 text-gray-300">
                        이 페이지는 로그인한 사용자만 접근할 수 있어요.
                        <br />
                        로그인 페이지로 이동할까요?
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleConfirm}
                            className="flex-1 rounded-md bg-[#f72585] py-2 text-white transition hover:brightness-90"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <Navbar />
            <main className="flex-1 pt-16 px-6 overflow-auto">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ProtectedLayout;
