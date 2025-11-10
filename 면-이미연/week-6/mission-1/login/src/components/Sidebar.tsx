import { NavLink } from "react-router-dom";

export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <aside
            className={`
        fixed top-16 left-0 z-40 h-[calc(100vh-64px)] w-60
        bg-[#111] text-gray-200 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0
        `}
        >
            <nav className="flex-1 px-2 space-y-1">
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
        </aside>
    );
}
