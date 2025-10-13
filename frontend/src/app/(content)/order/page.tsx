import styles from './page.module.css';
import { notoSerif } from '@/common/fonts';
import { UserGuard } from '@/common/guards';
import { OrderForm, OrderList } from '@/components/order-page';

function OrderPage() {
  return (
    <UserGuard>
      <div className={styles.container}>
        <h1 className={`${styles.title} ${notoSerif.className}`}>Đặt hàng</h1>
        <div className={styles.orderSection}>
          <OrderList />
          <OrderForm />
        </div>
      </div>
    </UserGuard>
  );
}

export default OrderPage;
