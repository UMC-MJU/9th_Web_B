import { useState } from "react";
import useDeleteAccount from "../hooks/mutations/useDeleteAccount";
import AlertModal from "./AlertModal";

interface SidebarProps {
  isOpen: boolean;
  onInnerClick?: (e: React.MouseEvent) => void;
}

const Sidebar = ({ isOpen, onInnerClick }: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteAccount } = useDeleteAccount();

  const handleDelete = () => {
    deleteAccount();
    setIsModalOpen(false);
  };

  return (
    <>
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 bg-[#0D0D0D] border-r border-gray-800 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
        onClick={onInnerClick}
      >
        <nav className="p-5 flex flex-col gap-3">
          <a href="/" className="text-gray-300 hover:text-purple-400 flex items-center gap-2">
            🏠 찾기
          </a>

          <a href="/me" className="text-gray-300 hover:text-purple-400 flex items-center gap-2">
            👤 마이페이지
          </a>

          {/* 🔥 탈퇴하기 버튼 */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-red-400 hover:text-red-500 flex items-center gap-2 mt-6 text-left"
          >
            ⚠️ 탈퇴하기
          </button>
        </nav>

        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-600">
          <p>© 2025 NOAH</p>
        </div>
      </aside>

   
      {isModalOpen && (
  <AlertModal
    message={"정말 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다."}
    onConfirm={handleDelete}
    onCancel={() => setIsModalOpen(false)}  
  />
)}
    </>
  );
};

export default Sidebar;
