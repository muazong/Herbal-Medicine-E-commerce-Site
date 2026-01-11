'use client';

import { useEffect, useState } from 'react';

import { PATH } from '@/common/enums';
import { Order } from '@/common/interfaces';
import { env, order_status_vi } from '@/common/config';
import styles from './dashboard-order.module.css';
import { getOrder } from '@/services/order-service';
import DashboardTitle from '../dashboard-title/dashboard-title';
import { paymen_method_vi } from '@/common/config/paymen-method-vi';
import DashboardBreadcrumb from '../dashboard-breadcrumb/dashboard-breadcrumb';
import { shortDesc } from '@/common/lib/short-desc';
import Link from 'next/link';
import Image from 'next/image';

function DashboardOrder({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getOrder(orderId);
      setOrder(data);
    })();
  }, [orderId]);

  if (!order) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className={styles.container}>
      <DashboardTitle title={`Đơn hàng ${order.id}`} />
      <DashboardBreadcrumb
        parentHref={PATH.ORDERS_MANAGEMENT}
        parenTitle="Quản lý đơn hàng"
        childTitle="Chi tiết đơn hàng"
      />

      <div className={styles.content}>
        <div className={styles.info}>
          <p>Tên khách hàng: {order.userName}</p>
          <p>Số điện thoại: {order.phoneNumber}</p>
        </div>
        <div className={styles.address}>Địa chỉ: {order.shippingAddress}</div>
        <div className={styles.paymentMethod}>
          Phương thức: {paymen_method_vi[order.paymentMethod]}
        </div>
        <div className={styles.status}>
          Trạng thái: {order_status_vi[order.status]}
        </div>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Mã sản phẩm</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá bán</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((orderItem) => (
                <tr key={orderItem.id}>
                  <td>{shortDesc(orderItem.product.id, 12)}</td>
                  <td className={styles.imageWrapper}>
                    <Image
                      loading="lazy"
                      src={`${env.SERVER_URL}${orderItem.product.media[0].path}`}
                      fill
                      alt={orderItem.product.name}
                    />
                  </td>
                  <td>
                    <Link href={`${PATH.PRODUCTS}/${orderItem.product.id}`}>
                      {orderItem.product.name}
                    </Link>
                  </td>
                  <td>{orderItem.quantity}</td>
                  <td>{orderItem.product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardOrder;
