import { create } from "zustand";
import cartItemsData from "../constants/cartItems";
import type { CartItems } from "../types/cart";

interface CartStoreState {
    cartItems: CartItems;
    amount: number;
    total: number;
    isModalOpen: boolean;

    increase: (payload: { id: string }) => void;
    decrease: (payload: { id: string }) => void;
    removeItem: (payload: { id: string }) => void;
    clearCart: () => void;
    calculateTotals: () => void;

    openModal: () => void;
    closeModal: () => void;
}

export const useCartStore = create<CartStoreState>((set, get) => ({
    cartItems: cartItemsData,
    amount: 0,
    total: 0,
    isModalOpen: false,

    // 증가
    increase: ({ id }) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item.id === id ? { ...item, amount: item.amount + 1 } : item
            ),
        })),

    // 감소
    decrease: ({ id }) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item.id === id ? { ...item, amount: item.amount - 1 } : item
            ),
        })),

    // 아이템 삭제
    removeItem: ({ id }) =>
        set((state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

    // 전체 삭제
    clearCart: () =>
        set({
            cartItems: [],
            amount: 0,
            total: 0,
        }),

    // 합계 계산
    calculateTotals: () => {
        const { cartItems } = get();

        let amount = 0;
        let total = 0;

        cartItems.forEach((item) => {
            amount += item.amount;
            total += item.amount * Number(item.price);
        });

        set({ amount, total });
    },

    // 모달 열기 / 닫기
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
}));
