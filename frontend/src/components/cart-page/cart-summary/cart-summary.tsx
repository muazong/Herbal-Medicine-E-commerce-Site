'use client';

import { useRouter } from 'next/navigation';

import { PATH } from '@/common/enums';
import styles from './cart-summary.module.css';
import useCartItemsStore from '@/stores/cart-item-store';
import formatCurrency from '@/common/lib/format-currency';

function CartSummary() {
  const router = useRouter();
  const cartItems = useCartItemsStore((state) => state.cartItems);
  const orderedItems = cartItems.filter((item) => item.isOrdered);
  const totalPrice = orderedItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thông tin hàng</h2>

      <div className={styles.info}>
        <p>Số lượng hàng: {orderedItems.length}</p>
        <p>Tổng giá: {formatCurrency(totalPrice)}</p>
      </div>

      <button
        className={styles.button}
        disabled={orderedItems.length === 0}
        onClick={() => router.push(PATH.ORDER)}
      >
        Đặt hàng
      </button>
    </div>
  );
}

export default CartSummary;
