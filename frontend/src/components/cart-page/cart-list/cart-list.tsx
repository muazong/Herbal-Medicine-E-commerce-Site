'use client';

import Cart from './cart-item';
import styles from './cart-list.module.css';
import useCartItemsStore from '@/stores/cart-item-store';

function CartList() {
  const cartItems = useCartItemsStore((state) => state.cartItems);

  return (
    <table className={styles.cartList}>
      <thead>
        <tr>
          <th>Đặt hàng</th>
          <th>Ảnh</th>
          <th>Tên sản phẩm</th>
          <th>Số lượng</th>
          <th>Trạng thái</th>
          <th>Tổng tiền</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {cartItems.map((item) => (
          <Cart key={item.id} cartItem={item} />
        ))}
      </tbody>
    </table>
  );
}

export default CartList;
