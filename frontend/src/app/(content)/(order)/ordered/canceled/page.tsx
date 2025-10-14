'use client';

import { useEffect } from 'react';

import styles from './page.module.css';
import { ORDER_STATUS } from '@/common/enums';
import { useOrderStore } from '@/stores/order-store';
import { getOrders } from '@/services/order-service';
import { OrderedList } from '@/components/ordered-page';

function CanceledPage() {
  const orders = useOrderStore((state) => state.orders);
  const ordersCanceled = orders.filter(
    (order) => order.status === ORDER_STATUS.CANCELLED,
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
      <OrderedList orders={ordersCanceled} />
    </div>
  );
}

export default CanceledPage;
