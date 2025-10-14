import { Metadata } from 'next';

import styles from './page.module.css';
import { notoSerif } from '@/common/fonts';
import { UserGuard } from '@/common/guards';
import { CartList, CartSummary } from '@/components/cart-page';

export const metadata: Metadata = {
  title: 'Giỏ hàng',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

function CartPage() {
  return (
    <UserGuard>
      <div className={styles.container}>
        <h1 className={notoSerif.className + ' ' + styles.title}>Giỏ hàng</h1>
        <div className={styles.cart}>
          <CartList />
          <CartSummary />
        </div>
      </div>
    </UserGuard>
  );
}

export default CartPage;
