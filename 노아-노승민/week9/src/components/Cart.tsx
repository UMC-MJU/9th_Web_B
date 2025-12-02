import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { increase, decrease, removeItem } from '../features/cart/cartSlice';
import { openModal } from '../features/modal/modalSlice';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, amount, total } = useSelector((state: RootState) => state.cart);

  const handleIncrease = (id: string) => {
    dispatch(increase(id));
  };

  const handleDecrease = (id: string) => {
    dispatch(decrease(id));
  };

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleClearCart = () => {
    dispatch(openModal());
  };

  const formatPrice = (price: number) => {
    return price.toString();
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">장바구니가 비어있습니다</h2>
          <p className="text-gray-600">음반을 추가해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-6 py-4"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-14 h-14 object-cover rounded flex-shrink-0"
              />
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-0.5">{item.singer}</p>
                <p className="text-sm text-gray-900">
                  ${formatPrice(parseInt(item.price))}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleDecrease(item.id)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold w-7 h-7 rounded text-xs transition-colors duration-200 flex items-center justify-center"
                >
                  -
                </button>
                <div className="bg-white border border-gray-300 w-9 h-7 rounded flex items-center justify-center text-xs font-semibold text-gray-900">
                  {item.amount}
                </div>
                <button
                  onClick={() => handleIncrease(item.id)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold w-7 h-7 rounded text-xs transition-colors duration-200 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-800">총 수량:</span>
            <span className="text-sm font-semibold text-gray-900">{amount}개</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-800">총 금액:</span>
            <span className="text-sm font-semibold text-gray-900">${formatPrice(total)}</span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleClearCart}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded border border-gray-300 transition-colors duration-200 text-sm"
            >
              전체 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


