import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Media } from '../media/entities/media.entity';
import { Product } from '../products/entities/product.entity';
import { Cart } from '../carts/entities/cart.entity';
import { CartItem } from '../cart-items/entities/cart-item.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  migrations: ['migrations/*.ts'],
  entities: [Media, User, Product, Cart, CartItem],
});
