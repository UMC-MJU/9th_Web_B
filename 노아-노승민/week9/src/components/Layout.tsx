import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Navbar from './Navbar';
import Modal from './Modal';

const Layout = () => {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

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

