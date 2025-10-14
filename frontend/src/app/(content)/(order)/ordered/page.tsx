import Link from 'next/link';

import { PATH } from '@/common/enums';
import styles from './page.module.css';
import { notoSerif } from '@/common/fonts';
import { OrderedList } from '@/components/ordered-page';

// TODO: Xếp loại order đã huỷ hoặc chưa huỷ ở đây và truyền thông qua OrderedList

function OrderedPage() {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.space}></span>
        <h1 className={`${styles.title} ${notoSerif.className}`}>Đơn hàng</h1>
        <Link href={PATH.ORDERED_CANCELED} className={styles.canceledLink}>
          Đơn hàng đã huỷ
        </Link>
      </div>
      <OrderedList />
    </div>
  );
}

export default OrderedPage;
