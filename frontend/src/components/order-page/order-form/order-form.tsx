'use client';

import { toast } from 'sonner';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { PATH } from '@/common/enums';
import styles from './order-form.module.css';
import { useUserStore } from '@/stores/user-store';
import useCartItemsStore from '@/stores/cart-item-store';
import { orderProducts } from '@/services/order-service';
import formatCurrency from '@/common/lib/format-currency';

function OrderForm() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const cartItems = useCartItemsStore((state) => state.cartItems);
  const orderedItems = cartItems.filter((item) => item.isOrdered);
  const deleteCartItem = useCartItemsStore((state) => state.deleteCartItem);

  const totalPrice = useMemo(
    () =>
      orderedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [orderedItems],
  );

  if (!user) {
    router.push(PATH.LOGIN);
    return null;
  }

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orders = await orderProducts();

    if (orders) {
      toast.success('Đặt hàng thành công!');
      for (const item of orderedItems) {
        deleteCartItem(item);
      }
      router.push(PATH.ORDERED);
    } else {
      toast.error('Đặt hàng thất bại!');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleOrderSubmit}>
      <h2>Thông tin giao hàng</h2>
      <label>
        Họ và tên:
        <input
          defaultValue={user.fullName}
          type="text"
          name="fullName"
          required
        />
      </label>
      <label>
        Số điện thoại:
        <input defaultValue={user.phone} type="tel" name="phone" required />
      </label>
      <label>
        Địa chỉ giao hàng:
        <textarea
          defaultValue={user.address}
          name="address"
          rows={3}
          required
        />
      </label>

      <div className={styles.total}>
        <span>Tổng tiền:</span>
        <strong>{formatCurrency(totalPrice)}</strong>
      </div>

      <button type="submit" className={styles.submitButton}>
        Xác nhận đặt hàng
      </button>
    </form>
  );
}

export default OrderForm;
