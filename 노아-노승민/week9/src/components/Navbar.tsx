import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center">
            <Link to="/" className="text-lg font-medium text-white">
              Noah
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


