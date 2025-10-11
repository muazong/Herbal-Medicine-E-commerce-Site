'use client';

import useCartItemsStore from '@/stores/cart-item-store';
import styles from './cart-summary.module.css';
import formatCurrency from '@/common/lib/format-currency';

function CartSummary() {
  const cartitems = useCartItemsStore((state) => state.cartItems);
  const totalPrice = cartitems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thông tin hàng</h2>

      <div className={styles.info}>
        <p>Số lượng hàng: {cartitems.length}</p>
        <p>Tổng giá: {formatCurrency(totalPrice)}</p>
      </div>

      <button>Đặt hàng</button>
    </div>
  );
}

export default CartSummary;
