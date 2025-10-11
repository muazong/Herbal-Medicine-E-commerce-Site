import { AbstractInterface } from './abstract-interface';
import { Product } from './product';

export interface CartItem extends AbstractInterface {
  product: Product;
  productId: string;
  quantity: number;
  isOrdered: boolean;
}
