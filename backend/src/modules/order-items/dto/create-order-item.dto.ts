import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';

export class CreateOrderItemDto {
  order: Order;
  product: Product;
  quantity: number;
}
