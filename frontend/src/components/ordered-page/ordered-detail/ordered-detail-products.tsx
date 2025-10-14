import { Order } from '@/common/interfaces';
import styles from './ordered-detail.module.css';
import formatCurrency from '@/common/lib/format-currency';
import Link from 'next/link';
import { PATH } from '@/common/enums';
import { order_status_vi } from '@/common/config';

function OrderedDetailProducts({ order }: { order: Order }) {
  return (
    <div className={styles.products}>
      <h2>Sản phẩm trong đơn | {order_status_vi[order.status]}</h2>
      <table>
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item) => (
            <tr key={item.id}>
              <td>
                <Link
                  className={styles.link}
                  href={`${PATH.PRODUCTS}/${item.product.id}`}
                >
                  {item.product.name}
                </Link>
              </td>
              <td>{item.quantity}</td>
              <td>{formatCurrency(item.product.price)}</td>
              <td>{formatCurrency(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.total}>
        Tổng cộng: <span>{formatCurrency(order.totalPrice)}</span>
      </div>
    </div>
  );
}

export default OrderedDetailProducts;
