import { Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Navbar from './Navbar';
import Modal from './Modal';

const Layout = () => {
  const isOpen = useStore((state) => state.isOpen);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className={isOpen ? 'blur-sm transition-all duration-300' : ''}>
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
      {isOpen && <Modal />}
    </div>
  );
};

export default Layout;

