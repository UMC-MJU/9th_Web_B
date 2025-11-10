import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus } from "lucide-react";

const HomeLayout = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            {/* 네비게이션 바 */}
            <Navbar />

            <main className="flex-1 pt-16 px-6 overflow-auto">
                <Outlet />
            </main>

            <button
                onClick={() => navigate("/create")}
                className="fixed bottom-6 right-6 bg-[#f72585] hover:brightness-90 text-white 
                rounded-full w-12 h-12 flex items-center justify-center shadow-lg 
                border border-gray-700 transition-all duration-200 hover:scale-105"
                aria-label="콘텐츠 생성"
            >
                <Plus size={26} />
            </button>
            
            <Footer />
        </div>
    );
};

export default HomeLayout;
