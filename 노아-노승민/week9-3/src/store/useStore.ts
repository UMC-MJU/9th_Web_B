import { create } from 'zustand';
import { CartItem } from '../constants/cartItems';
import cartItems from '../constants/cartItems';

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

interface ModalState {
  isOpen: boolean;
}

interface StoreState extends CartState, ModalState {
  // Cart Actions
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  // Modal Actions
  openModal: () => void;
  closeModal: () => void;
}

// 초기값 계산 헬퍼 함수
const calculateInitialTotals = (items: CartItem[]) => {
  const amount = items.reduce((sum, item) => sum + item.amount, 0);
  const total = items.reduce((sum, item) => sum + parseInt(item.price) * item.amount, 0);
  return { amount, total };
};

const initialTotals = calculateInitialTotals(cartItems);

// 총합 계산 헬퍼 함수
const calculateTotalsHelper = (cartItems: CartItem[]) => {
  const amount = cartItems.reduce((sum, item) => sum + item.amount, 0);
  const total = cartItems.reduce((sum, item) => sum + parseInt(item.price) * item.amount, 0);
  return { amount, total };
};

export const useStore = create<StoreState>((set) => ({
  // 초기 상태
  cartItems: cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
  isOpen: false,

  // Cart Actions
  increase: (id: string) =>
    set((state) => {
      const updatedItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      const { amount, total } = calculateTotalsHelper(updatedItems);
      return {
        cartItems: updatedItems,
        amount,
        total,
      };
    }),

  decrease: (id: string) =>
    set((state) => {
      const updatedItems = state.cartItems
        .map((item) => (item.id === id ? { ...item, amount: item.amount - 1 } : item))
        .filter((item) => item.amount > 0);
      const { amount, total } = calculateTotalsHelper(updatedItems);
      return {
        cartItems: updatedItems,
        amount,
        total,
      };
    }),

  removeItem: (id: string) =>
    set((state) => {
      const updatedItems = state.cartItems.filter((item) => item.id !== id);
      const { amount, total } = calculateTotalsHelper(updatedItems);
      return {
        cartItems: updatedItems,
        amount,
        total,
      };
    }),

  clearCart: () =>
    set(() => ({
      cartItems: [],
      amount: 0,
      total: 0,
    })),

  calculateTotals: () =>
    set((state) => {
      const { amount, total } = calculateTotalsHelper(state.cartItems);
      return {
        amount,
        total,
      };
    }),

  // Modal Actions
  openModal: () =>
    set(() => ({
      isOpen: true,
    })),

  closeModal: () =>
    set(() => ({
      isOpen: false,
    })),
}));

