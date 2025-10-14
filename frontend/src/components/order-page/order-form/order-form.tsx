'use client';

import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { PATH, PAYMENT_METHOD } from '@/common/enums';
import styles from './order-form.module.css';
import { useUserStore } from '@/stores/user-store';
import useCartItemsStore from '@/stores/cart-item-store';
import { OrderFormData, orderProducts } from '@/services/order-service';
import formatCurrency from '@/common/lib/format-currency';
import { paymen_method_vi } from '@/common/config/paymen-method-vi';

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
    const formData = new FormData(e.target as HTMLFormElement);

    const userName = formData.get('userName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const shippingAddress = formData.get('shippingAddress') as string;
    const paymentMethod = formData.get('paymentMethod') as PAYMENT_METHOD;

    const orderFormData: OrderFormData = {
      paymentMethod,
      phoneNumber,
      shippingAddress,
      userName,
    };

    const orders = await orderProducts(orderFormData);

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
          name="userName"
          required
        />
      </label>

      <label>
        Số điện thoại:
        <input
          defaultValue={user.phone}
          type="tel"
          name="phoneNumber"
          required
        />
      </label>

      <label>
        Phương thức thanh toán:
        <select name="paymentMethod" required>
          <option value={PAYMENT_METHOD.CASH}>
            {paymen_method_vi[PAYMENT_METHOD.CASH]}
          </option>
          <option value={PAYMENT_METHOD.TRANSFER}>
            {paymen_method_vi[PAYMENT_METHOD.TRANSFER]}
          </option>
        </select>
      </label>

      <label>
        Địa chỉ giao hàng:
        <textarea
          defaultValue={user.address}
          name="shippingAddress"
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
