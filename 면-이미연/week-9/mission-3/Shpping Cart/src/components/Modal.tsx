import { useCartStore } from "../store/useCartStore";

const Modal = () => {
    const isModalOpen = useCartStore((state) => state.isModalOpen);
    const clearCart = useCartStore((state) => state.clearCart);
    const closeModal = useCartStore((state) => state.closeModal);

    if (!isModalOpen) return null;

    const handleConfirm = () => {
        clearCart();
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
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