import { CartList, CartSummary } from '@/components/cart-page';
import styles from './page.module.css';
import { notoSerif } from '@/common/fonts';
import { UserGuard } from '@/common/guards';

function CartPage() {
  return (
    <UserGuard>
      <div className={styles.container}>
        <h1 className={notoSerif.className}>Giỏ hàng</h1>
        <div className={styles.cart}>
          <CartList />
          <CartSummary />
        </div>
      </div>
    </UserGuard>
  );
}

export default CartPage;
