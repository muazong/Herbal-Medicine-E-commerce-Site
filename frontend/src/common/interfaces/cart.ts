import { AbstractInterface } from './abstract-interface';
import { CartItem } from './cart-item';

export interface Cart extends AbstractInterface {
  userId: string;
  cartItems: CartItem[];
}
