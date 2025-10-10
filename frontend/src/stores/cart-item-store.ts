'use client';

import { create } from 'zustand';
import { CartItem } from '@/common/interfaces';

type CartItemStore = {
  cartItems: CartItem[];
  length: number;
  setCartItems: (cartItems: CartItem[]) => void;
  addCartItem: (cartItem: CartItem, quantity: number) => void;
  deleteCartItem: (cartItem: CartItem) => void;
};

const useCartItemsStore = create<CartItemStore>((set) => {
  return {
    cartItems: [],
    length: 0,
    setCartItems: (cartItems) => set({ cartItems, length: cartItems.length }),
    addCartItem: (cartItem, quantity) =>
      set((state) => {
        const existingCartItem = state.cartItems.find(
          (item) => item.id === cartItem.id,
        );

        if (existingCartItem) {
          const updatedItems = state.cartItems.map((item) =>
            item.id === cartItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );

          return {
            cartItems: updatedItems,
            length: updatedItems.length,
          };
        } else {
          const newCart = [...state.cartItems, cartItem];
          return {
            cartItems: newCart,
            length: newCart.length,
          };
        }
      }),
    deleteCartItem: (cartItem) => {
      set((state) => {
        const newCart = state.cartItems.filter(
          (item) => item.id !== cartItem.id,
        );
        return {
          cartItems: newCart,
          length: newCart.length,
        };
      });
    },
  };
});

export default useCartItemsStore;
