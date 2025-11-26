import { useCartStore } from "../store/useCartStore";

const PriceBox = () => {
    const total = useCartStore((state) => state.total);
    const openModal = useCartStore((state) => state.openModal);

    const handleInitializeCart = () => {
        openModal();
    };

    return (
        <div className='p-12 flex justify-between'>
            <button
                onClick={handleInitializeCart}
                className='border p-4 rounded-md cursor-pointer'
            >
                장바구니 초기화
            </button>
            <div>총 가격: {total}원</div>
        </div>
    );
};

export default PriceBox;
