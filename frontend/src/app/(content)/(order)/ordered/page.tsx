'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import styles from './page.module.css';
import { notoSerif } from '@/common/fonts';
import { ORDER_STATUS, PATH } from '@/common/enums';
import { useOrderStore } from '@/stores/order-store';
import { getOrders } from '@/services/order-service';
import { OrderedList } from '@/components/ordered-page';

function OrderedPage() {
  const orders = useOrderStore((state) => state.orders);
  const ordersWithoutCanceled = orders.filter(
    (order) => order.status !== ORDER_STATUS.CANCELLED,
  );
  const setOrders = useOrderStore((state) => state.setOrders);

  useEffect(() => {
    (async () => {
      const data = await getOrders('createdAt');
      setOrders(data || []);
    })();
  }, [setOrders]);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.space}></span>
        <h1 className={`${styles.title} ${notoSerif.className}`}>Đơn hàng</h1>
        <Link href={PATH.ORDERED_CANCELED} className={styles.canceledLink}>
          Đơn hàng đã huỷ
        </Link>
      </div>
      <OrderedList orders={ordersWithoutCanceled} />
    </div>
  );
}

export default OrderedPage;
