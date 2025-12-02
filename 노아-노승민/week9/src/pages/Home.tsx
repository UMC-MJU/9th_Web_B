import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Noah에 오신 것을 환영합니다!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Redux Toolkit을 활용한 장바구니 시스템을 경험해보세요.
          </p>
          <Link
            to="/cart"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            장바구니 보기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;


