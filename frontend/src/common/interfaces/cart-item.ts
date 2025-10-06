import { AbstractInterface } from './abstract-interface';

export interface CartItem extends AbstractInterface {
  productId: string;
  quantity: number;
}
