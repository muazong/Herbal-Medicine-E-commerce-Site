'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Order } from '@/common/interfaces';
import styles from './ordered-detail.module.css';
import { ORDER_STATUS, PATH, PAYMENT_METHOD } from '@/common/enums';
import { paymen_method_vi } from '@/common/config/paymen-method-vi';
import { OrderFormData, updateUserOrder } from '@/services/order-service';

function OrderedDetailForm({ order }: { order: Order }) {
  const router = useRouter();
  const [orderDataForm, setOrderDataForm] = useState<OrderFormData>({
    paymentMethod: order.paymentMethod,
    phoneNumber: order.phoneNumber,
    shippingAddress: order.shippingAddress,
    userName: order.userName,
  });

  const handleSaveOrder = async () => {
    const { paymentMethod, phoneNumber, shippingAddress } = orderDataForm;
    const result = await updateUserOrder({
      paymentMethod,
      phoneNumber,
      shippingAddress,
    });
    if (result) {
      toast.success('Đơn hàng đã được cập nhật');
    } else {
      toast.error('Đơn hàng không thể được cập nhật');
    }
  };

  const handleCancelOrder = async () => {
    const result = await updateUserOrder({ status: ORDER_STATUS.CANCELLED });
    if (result) {
      toast.success('Đơn hàng đã được hủy');
      router.replace(PATH.ORDERED);
    } else {
      toast.error('Đơn hàng không thể được hủy');
    }
  };

  return (
    <form className={styles.form}>
      <label>Tên người mua:</label>
      <input type="text" defaultValue={order.userName} disabled />

      <label>Số điện thoại:</label>
      <input
        type="tel"
        value={orderDataForm.phoneNumber}
        onChange={(e) =>
          setOrderDataForm({ ...orderDataForm, phoneNumber: e.target.value })
        }
        disabled={order.status !== ORDER_STATUS.PENDING}
      />

      <label>Địa chỉ giao hàng:</label>
      <input
        type="text"
        value={orderDataForm.shippingAddress}
        onChange={(e) =>
          setOrderDataForm({
            ...orderDataForm,
            shippingAddress: e.target.value,
          })
        }
        disabled={order.status !== ORDER_STATUS.PENDING}
      />

      <label>Phương thức thanh toán:</label>
      <select
        value={orderDataForm.paymentMethod}
        disabled={order.status !== ORDER_STATUS.PENDING}
        onChange={(e) =>
          setOrderDataForm({
            ...orderDataForm,
            paymentMethod: e.target.value as PAYMENT_METHOD,
          })
        }
      >
        <option value={PAYMENT_METHOD.CASH}>
          {paymen_method_vi[PAYMENT_METHOD.CASH]}
        </option>
        <option value={PAYMENT_METHOD.TRANSFER}>
          {paymen_method_vi[PAYMENT_METHOD.TRANSFER]}
        </option>
      </select>

      <div className={styles.buttons}>
        <button
          type="button"
          disabled={order.status !== ORDER_STATUS.PENDING}
          className={styles.saveBtn}
          onClick={handleSaveOrder}
        >
          Lưu thay đổi
        </button>
        <button
          type="button"
          disabled={
            order.status !== ORDER_STATUS.PENDING &&
            order.status !== ORDER_STATUS.CONFIRMED
          }
          onClick={handleCancelOrder}
          className={styles.cancelBtn}
        >
          Hủy đơn hàng
        </button>
      </div>
    </form>
  );
}

export default OrderedDetailForm;
