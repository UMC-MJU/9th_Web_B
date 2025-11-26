import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlices";

const Modal = () => {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.modal);

    // 모달이 닫힌 상태면 아예 렌더링하지 않음
    if (!isOpen) return null;

    const handleConfirm = () => {
        // 장바구니 비우기 + 모달 닫기
        dispatch(clearCart());
        dispatch(closeModal());
    };

    const handleCancel = () => {
        // 그냥 모달만 닫기
        dispatch(closeModal());
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-72">
                <h2 className="text-lg font-semibold mb-4">
                    정말 장바구니를 모두 비우시겠어요?
                </h2>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleCancel}
                        className="px-3 py-1 border rounded"
                    >
                        아니요
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                        네
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
