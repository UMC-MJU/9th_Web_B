import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import AlertModal from "../components/AlertModal";

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowModal(true);
    }
  }, [loading, isAuthenticated]);

  const handleConfirm = () => {
    setShowModal(false);
    navigate(`/login?redirect=${location.pathname}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        확인 중...
      </div>
    );
  }

  if (!isAuthenticated) {
    return showModal ? (
      <AlertModal message="로그인이 필요한 페이지입니다." onConfirm={handleConfirm} />
    ) : null;
  }

  return <Outlet />;
}
