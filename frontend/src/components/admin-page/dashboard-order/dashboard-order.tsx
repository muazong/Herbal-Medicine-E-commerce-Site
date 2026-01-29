'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

import { PATH, ORDER_STATUS } from '@/common/enums';
import { Order } from '@/common/interfaces';
import { env, order_status_vi } from '@/common/config';
import { paymen_method_vi } from '@/common/config/paymen-method-vi';

import styles from './dashboard-order.module.css';

import { getOrder, updateOrderStatus } from '@/services/order-service';
import DashboardTitle from '../dashboard-title/dashboard-title';
import DashboardBreadcrumb from '../dashboard-breadcrumb/dashboard-breadcrumb';
import { shortDesc } from '@/common/lib/short-desc';

function DashboardOrder({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ORDER_STATUS | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getOrder(orderId);
      setOrder(data);
      setSelectedStatus(data?.status ?? null);
    })();
  }, [orderId]);

  const handleSaveStatus = async () => {
    if (!order || !selectedStatus) return;

    setLoading(true);
    const updated = await updateOrderStatus(order.id, selectedStatus);
    setLoading(false);

    if (!updated) {
      toast.error('Cập nhật trạng thái thất bại');
      return;
    }

    toast.success('Cập nhật trạng thái thành công');
    setOrder({ ...order, status: selectedStatus });
  };

  if (!order) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  const isDisabled =
    loading ||
    order.status === ORDER_STATUS.DELIVERED ||
    order.status === ORDER_STATUS.CANCELLED;

  const isUnchanged = selectedStatus === order.status;

  return (
    <div className={styles.container}>
      <DashboardTitle title={`Đơn hàng ${shortDesc(order.id, 8)}`} />

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
          Phương thức thanh toán: {paymen_method_vi[order.paymentMethod]}
        </div>

        {/* STATUS */}
        <div className={styles.status}>
          <span>Trạng thái:</span>

          <select
            className={styles.statusSelect}
            value={selectedStatus ?? ''}
            disabled={isDisabled}
            onChange={(e) => setSelectedStatus(e.target.value as ORDER_STATUS)}
          >
            {Object.values(ORDER_STATUS).map((status) => (
              <option key={status} value={status}>
                {order_status_vi[status]}
              </option>
            ))}
          </select>

          <button
            className={styles.saveBtn}
            disabled={isDisabled || isUnchanged}
            onClick={handleSaveStatus}
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
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
                      src={`${env.SERVER_URL}${orderItem.product.media[0].path}`}
                      alt={orderItem.product.name}
                      fill
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
