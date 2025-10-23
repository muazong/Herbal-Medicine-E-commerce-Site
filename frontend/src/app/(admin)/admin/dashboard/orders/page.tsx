'use client';

import { useEffect } from 'react';
import styles from './page.module.css';
import { getOrders } from '@/services/order-service';
import { useOrderStore } from '@/stores/order-store';
import { DashboardTitle } from '@/components/admin-page';
import formatCurrency from '@/common/lib/format-currency';
import { order_status_vi } from '@/common/config';

function OrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const setOrders = useOrderStore((state) => state.setOrders);

  useEffect(() => {
    (async () => {
      const data = await getOrders();
      setOrders(data || []);
    })();
  }, [setOrders]);

  return (
    <div className={styles.container}>
      <DashboardTitle title="Quản lý đơn hàng" />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Tên khách hàng</th>
            <th>SĐT</th>
            <th>Địa chỉ</th>
            <th>Phương thức TT</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.empty}>
                Không có đơn hàng nào
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userName}</td>
                <td>{order.phoneNumber}</td>
                <td>{order.shippingAddress}</td>
                <td>{order.paymentMethod}</td>
                <td>{formatCurrency(order.totalPrice)}</td>
                <td className={styles.status}>
                  {order_status_vi[order.status]}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersPage;
