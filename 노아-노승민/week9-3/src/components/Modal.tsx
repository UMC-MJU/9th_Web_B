import { useStore } from '../store/useStore';

const Modal = () => {
  const { closeModal, clearCart } = useStore();

  const handleNo = () => {
    closeModal();
  };

  const handleYes = () => {
    clearCart();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleNo}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          정말로 삭제하시겠습니까?
        </h2>
        <p className="text-gray-600 mb-6">
          장바구니의 모든 아이템이 삭제됩니다.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleNo}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition-colors duration-200"
          >
            아니요
          </button>
          <button
            onClick={handleYes}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition-colors duration-200"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

