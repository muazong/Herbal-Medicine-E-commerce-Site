'use client';

import styles from './order-list.module.css';
import OrderItem from '../order-item/order-item';
import useCartItemsStore from '@/stores/cart-item-store';

function OrderList() {
  const cartItems = useCartItemsStore((state) => state.cartItems);
  const orderedItems = cartItems.filter((item) => item.isOrdered);

  return (
    <div className={styles.productList}>
      <h2>Sản phẩm đã chọn</h2>

      {orderedItems.length === 0 ? (
        <p>Không có sản phẩm nào được chọn để đặt hàng.</p>
      ) : (
        orderedItems.map((item) => {
          return <OrderItem orderItem={item} key={item.id} />;
        })
      )}
    </div>
  );
}

export default OrderList;
