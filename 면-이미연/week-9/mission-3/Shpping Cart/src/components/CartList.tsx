import CartItem from "./CartItem";
import { useCartStore } from "../store/useCartStore";

const CartList = () => {
    const cartItems = useCartStore((state) => state.cartItems);

    return (
        <div className='flex flex-col items-center justify-center'>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.id}>
                        <CartItem lp={item} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CartList;