import { Order } from '@/common/interfaces';
import styles from './ordered-list.module.css';
import { order_status_vi } from '@/common/config';
import formatDayVi from '@/common/lib/format-day-vi';
import OrderedItem from '../ordered-item/ordered-item';
import formatCurrency from '@/common/lib/format-currency';

function OrderedList({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return <div>Chưa có đơn hàng nào</div>;
  }

  return (
    <div className={styles.container}>
      {orders.map((order) => {
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
