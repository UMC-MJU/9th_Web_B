import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="flex flex-col min-h-screen bg-[#0B0B0B] text-white"

      onClick={() => {
        if (isSidebarOpen) setIsSidebarOpen(false);
      }}
    >
      <Navbar
        onToggleSidebar={(e?: React.MouseEvent) => {

          e?.stopPropagation();
          setIsSidebarOpen((prev) => !prev);
        }}
      />

      <div className="relative flex flex-1 min-h-0">

        <Sidebar isOpen={isSidebarOpen} onInnerClick={(e) => e.stopPropagation()} />

        <main className="flex-1 mt-16 pt-6 px-6 md:px-10 overflow-y-auto">
          <div className="w-full max-w-[2000px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="p-4 bg-black text-white text-center border-t border-gray-700 text-xs">
        © 2025 NOAH
      </footer>
    </div>
  );
};

export default HomeLayout;
