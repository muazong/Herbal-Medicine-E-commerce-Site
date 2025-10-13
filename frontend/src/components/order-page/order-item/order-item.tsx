import Image from 'next/image';
import { TiTimes } from 'react-icons/ti';

import { env } from '@/common/config';
import styles from './order-item.module.css';
import { CartItem } from '@/common/interfaces';
import formatCurrency from '@/common/lib/format-currency';

function OrderItem({ orderItem }: { orderItem: CartItem }) {
  return (
    <div key={orderItem.id} className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={
            orderItem.product.media.length > 0
              ? `${env.SERVER_URL}${orderItem.product.media[0].path}`
              : env.PRODUCT_URL
          }
          alt={orderItem.product.name}
          fill
          className={styles.image}
        />
      </div>
      <div className={styles.productInfo}>
        <h3>{orderItem.product.name}</h3>
        <p>{orderItem.product.description}</p>
        <div className={styles.priceRow}>
          <span>
            {orderItem.quantity} <TiTimes />{' '}
            {formatCurrency(orderItem.product.price)}
          </span>
          <strong>
            {formatCurrency(orderItem.product.price * orderItem.quantity)}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default OrderItem;
