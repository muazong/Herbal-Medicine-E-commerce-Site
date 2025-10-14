'use client';

import { useEffect } from 'react';

import { ORDER_STATUS } from '@/common/enums';
import styles from './ordered-list.module.css';
import { order_status_vi } from '@/common/config';
import formatDayVi from '@/common/lib/format-day-vi';
import { useOrderStore } from '@/stores/order-store';
import { getOrders } from '@/services/order-service';
import OrderedItem from '../ordered-item/ordered-item';
import formatCurrency from '@/common/lib/format-currency';

function OrderedList({ canceled = false }: { canceled?: boolean }) {
  const orders = useOrderStore((state) => state.orders);
  const setOrders = useOrderStore((state) => state.setOrders);

  useEffect(() => {
    (async () => {
      const data = await getOrders('createdAt');
      setOrders(data || []);
    })();
  }, [setOrders]);

  const filteredOrders = orders.filter((order) =>
    canceled
      ? order.status === ORDER_STATUS.CANCELLED
      : order.status !== ORDER_STATUS.CANCELLED,
  );

  if (!filteredOrders.length) {
    return <div>Chưa có đơn hàng nào</div>;
  }

  return (
    <div className={styles.container}>
      {filteredOrders.map((order) => {
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
