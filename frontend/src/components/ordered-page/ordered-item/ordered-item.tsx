import { Order } from '@/common/interfaces';
import styles from './ordered-item.module.css';
import formatCurrency from '@/common/lib/format-currency';
import OrderedItemProduct from './ordered-item-product';
import { paymen_method_vi } from '@/common/config/paymen-method-vi';

function OrderedItem({ order }: { order: Order }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Số lượng</th>
          <th>Đơn giá</th>
          <th>Tổng</th>
          <th>Địa chỉ</th>
          <th>Trạng thái</th>
          <th>Thời gian đặt</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {order.orderItems.map((item) => {
          return (
            <OrderedItemProduct
              item={item}
              shippingAddress={order.shippingAddress}
              key={item.id}
            />
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={8} className={styles.total}>
            <p>Tổng đơn hàng: {formatCurrency(order.totalPrice)}</p>
            <p>
              Phương thức thanh toán: {paymen_method_vi[order.paymentMethod]}
            </p>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default OrderedItem;
