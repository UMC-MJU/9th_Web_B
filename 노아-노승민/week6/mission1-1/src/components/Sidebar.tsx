interface SidebarProps {
  isOpen: boolean;
  onInnerClick?: (e: React.MouseEvent) => void;
}

const Sidebar = ({ isOpen, onInnerClick }: SidebarProps) => {
  return (
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
      </nav>
      <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-600">
        <p>© 2025 NOAH</p>
      </div>
    </aside>
  );
};

export default Sidebar;
