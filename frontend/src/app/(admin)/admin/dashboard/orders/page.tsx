'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { PATH } from '@/common/enums';
import styles from './page.module.css';
import { order_status_vi } from '@/common/config';
import { shortDesc } from '@/common/lib/short-desc';
import { getOrders } from '@/services/order-service';
import { useOrderStore } from '@/stores/order-store';
import { DashboardTitle } from '@/components/admin-page';
import formatCurrency from '@/common/lib/format-currency';
import { paymen_method_vi } from '@/common/config/paymen-method-vi';

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
            <th>Thao tác</th>
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
                <td>{shortDesc(order.id, 6)}</td>
                <td>{order.userName}</td>
                <td>{order.phoneNumber}</td>
                <td>{order.shippingAddress}</td>
                <td>{paymen_method_vi[order.paymentMethod]}</td>
                <td>{formatCurrency(order.totalPrice)}</td>
                <td className={styles.status}>
                  {order_status_vi[order.status]}
                </td>
                <td>
                  <Link
                    href={`${PATH.ORDERS_MANAGEMENT}/${order.id}`}
                    className={styles.action}
                  >
                    Xem chi tiết
                  </Link>
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
