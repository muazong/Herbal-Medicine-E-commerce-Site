import { create } from 'zustand';
import { CartItem } from '@/common/interfaces';

type CartItemStore = {
  cartItems: CartItem[];
  length: number;
  getCartItem: (cartItemId: string) => CartItem | undefined;
  setCartItems: (cartItems: CartItem[]) => void;
  addCartItem: (cartItem: CartItem, quantity: number) => void;
  deleteCartItem: (cartItem: CartItem) => void;
  updateCartItem: (
    cartItem: CartItem,
    { quantity, isOrdered }: { quantity?: number; isOrdered?: boolean },
  ) => void;
};

const useCartItemsStore = create<CartItemStore>((set, get) => {
  return {
    cartItems: [],
    length: 0,
    getCartItem: (cartItemId) => {
      const cartItem = get().cartItems.find((item) => item.id === cartItemId);
      return cartItem;
    },
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
    updateCartItem: (cartItem, { quantity, isOrdered }) => {
      set((state) => {
        const updatedItems = state.cartItems.map((item) => {
          if (item.id === cartItem.id) {
            return {
              ...item,
              quantity: quantity !== undefined ? quantity : item.quantity,
              isOrdered: isOrdered !== undefined ? isOrdered : item.isOrdered,
            };
          }
          return item;
        });

        return {
          cartItems: updatedItems,
          length: updatedItems.length,
        };
      });
    },
  };
});

export default useCartItemsStore;
