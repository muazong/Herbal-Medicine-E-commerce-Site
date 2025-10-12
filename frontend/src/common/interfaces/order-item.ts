import { Product } from './product';
import { ORDER_STATUS } from '../enums';
import { AbstractInterface } from './abstract-interface';

export interface OrderItem extends AbstractInterface {
  orderId: string;
  product: Product;
  quantity: number;
  totalPrice: number;
  status: ORDER_STATUS;
}
