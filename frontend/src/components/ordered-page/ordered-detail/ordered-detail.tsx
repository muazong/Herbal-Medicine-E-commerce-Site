'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Order } from '@/common/interfaces';
import { ORDER_STATUS } from '@/common/enums';
import styles from './ordered-detail.module.css';
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

  if (order.status === ORDER_STATUS.CANCELLED) {
    notFound();
  }

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
