'use client';

import Image from 'next/image';

import { env } from '@/common/config';
import styles from './order-list.module.css';
import useCartItemsStore from '@/stores/cart-item-store';
import formatCurrency from '@/common/lib/format-currency';

function OrderList() {
  const cartItems = useCartItemsStore((state) => state.cartItems);
  const orderedItems = cartItems.filter((item) => item.isOrdered);

  return (
    <div className={styles.productList}>
      <h2>Sản phẩm đã chọn</h2>

      {orderedItems.length === 0 ? (
        <p>Không có sản phẩm nào được chọn để đặt hàng.</p>
      ) : (
        orderedItems.map((item) => (
          <div key={item.id} className={styles.productCard}>
            <div className={styles.imageWrapper}>
              <Image
                src={
                  item.product.media.length > 0
                    ? `${env.SERVER_URL}${item.product.media[0].path}`
                    : env.PRODUCT_URL
                }
                alt={item.product.name}
                fill
                className={styles.image}
              />
            </div>
            <div className={styles.productInfo}>
              <h3>{item.product.name}</h3>
              <p>{item.product.description}</p>
              <div className={styles.priceRow}>
                <span>
                  {item.quantity} × {formatCurrency(item.product.price)}
                </span>
                <strong>
                  {formatCurrency(item.product.price * item.quantity)}
                </strong>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderList;
