'use client';

import { useEffect } from 'react';

import styles from './ordered-list.module.css';
import { order_status_vi } from '@/common/config';
import formatDayVi from '@/common/lib/format-day-vi';
import { getOrders } from '@/services/order-service';
import { useOrderStore } from '@/stores/order-store';
import OrderedItem from '../ordered-item/ordered-item';
import formatCurrency from '@/common/lib/format-currency';
import { ORDER_STATUS } from '@/common/enums';

function OrderedList() {
  const orders = useOrderStore((state) => state.orders);
  const setOrders = useOrderStore((state) => state.setOrders);

  useEffect(() => {
    (async () => {
      const data = await getOrders('createdAt');
      setOrders(data || []);
    })();
  }, [setOrders]);

  if (!orders.length) {
    return <div>Chưa có đơn hàng nào</div>;
  }

  return (
    <div className={styles.container}>
      {orders.map((order) => {
        if (order.status === ORDER_STATUS.CANCELLED) return null;

        return (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <h3>Đơn hàng ngày {formatDayVi(order.createdAt, false)}</h3>
              <span>
                {order_status_vi[order.status]} | Tổng:{' '}
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
            <OrderedItem order={order} />
          </div>
        );
      })}
    </div>
  );
}

export default OrderedList;
