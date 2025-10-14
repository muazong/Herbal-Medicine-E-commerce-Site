'use client';

import { useEffect, useState } from 'react';
import styles from './ordered-detail.module.css';

import { Order } from '@/common/interfaces';
import { getOrder } from '@/services/order-service';
import OrderedDetailForm from './ordered-detail-form';
import OrderedDetailProducts from './ordered-detail-products';

export default function OrderedDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getOrder(orderId);
      setOrder(data);
    })();
  }, [orderId]);

  if (!order) return <div className={styles.empty}>Đang tải đơn hàng...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chi tiết đơn hàng #{order.id}</h1>

      <div className={styles.content}>
        <OrderedDetailForm order={order} />
        <OrderedDetailProducts order={order} />
      </div>
    </div>
  );
}
