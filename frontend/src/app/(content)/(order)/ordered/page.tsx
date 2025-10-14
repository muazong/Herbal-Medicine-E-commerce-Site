import styles from './page.module.css';
import { notoSerif } from '@/common/fonts';
import { OrderedList } from '@/components/ordered-page';

function OrderedPage() {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} ${notoSerif.className}`}>Đơn hàng</h1>
      <OrderedList />
    </div>
  );
}

export default OrderedPage;
