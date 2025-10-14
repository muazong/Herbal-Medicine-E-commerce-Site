import Link from 'next/link';

import { PATH } from '@/common/enums';
import styles from './ordered-item.module.css';
import { OrderItem } from '@/common/interfaces';
import { order_status_vi } from '@/common/config';
import formatDayVi from '@/common/lib/format-day-vi';

function OrderedItemProduct({
  item,
  shippingAddress,
}: {
  item: OrderItem;
  shippingAddress: string;
}) {
  return (
    <tr key={item.id}>
      <td>{item.product.name}</td>
      <td>{item.quantity}</td>
      <td>{item.product.price.toLocaleString()}₫</td>
      <td>{item.totalPrice.toLocaleString()}₫</td>
      <td>{shippingAddress}</td>
      <td>{order_status_vi[item.status]}</td>
      <td>{formatDayVi(item.createdAt)}</td>
      <td>
        <Link
          className={styles.detail}
          href={`${PATH.ORDERED}/${item.orderId}`}
        >
          Xem chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default OrderedItemProduct;
