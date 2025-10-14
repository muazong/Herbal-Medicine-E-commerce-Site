import { Metadata } from 'next';

import styles from './page.module.css';
import { notoSerif } from '@/common/fonts';
import { UserGuard } from '@/common/guards';
import { OrderForm, OrderList } from '@/components/order-page';

export const metadata: Metadata = {
  title: 'Đặt hàng',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

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
