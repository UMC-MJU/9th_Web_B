import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useWithdrawMutation } from "../hooks/useWithdrawMutation";

export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate: withdraw, isPending } = useWithdrawMutation();

    const handleWithdrawClick = () => {
        onClose();
        setIsModalOpen(true);
    };

    const handleConfirmWithdraw = () => {
        if (isPending) return;
        withdraw();
    };

    const handleCancelWithdraw = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <aside
                className={`
        fixed top-16 left-0 z-40 h-[calc(100vh-64px)] w-60
        bg-[#111] text-gray-200 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0
        flex flex-col
        `}
            >
                <nav className="flex-1 px-2 space-y-1 py-4">
                    <NavLink
                        to="/search"
                        className={({ isActive }) =>
                            `flex items-center gap-2 rounded-md px-3 py-2 text-sm 
            ${isActive ? "bg-[#1a1a1a] text-white" : "hover:bg-[#1a1a1a]"}`
                        }
                        onClick={onClose}
                    >
                        <span aria-hidden>🔍</span> 찾기
                    </NavLink>

                    <NavLink
                        to="/my"
                        className={({ isActive }) =>
                            `flex items-center gap-2 rounded-md px-3 py-2 text-sm 
            ${isActive ? "bg-[#1a1a1a] text-white" : "hover:bg-[#1a1a1a]"}`
                        }
                        onClick={onClose}
                    >
                        <span aria-hidden>👤</span> 마이페이지
                    </NavLink>
                </nav>

                <div className="p-4">
                    <button
                        onClick={handleWithdrawClick}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm w-full 
                            text-gray-400 hover:bg-red-900/50 hover:text-red-300 
                            transition-colors duration-150"
                    >
                        <span aria-hidden></span> 탈퇴하기
                    </button>
                </div>
            </aside>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                    onClick={handleCancelWithdraw}
                >
                    <div
                        className="bg-gray-800 rounded-lg p-8 shadow-xl w-80"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-white text-center text-lg mb-6">
                            정말 탈퇴하시겠습니까?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleConfirmWithdraw}
                                disabled={isPending}
                                className={`px-6 py-2 rounded font-bold text-black transition-colors ${
                                    isPending
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-gray-200 hover:bg-white"
                                }`}
                            >
                                {isPending ? "처리 중..." : "예"}
                            </button>
                            <button
                                onClick={handleCancelWithdraw}
                                className="px-6 py-2 rounded font-bold text-white bg-pink-500 hover:bg-pink-600 transition-colors"
                            >
                                아니오
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}