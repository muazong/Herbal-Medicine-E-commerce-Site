import Link from 'next/link';
import { Metadata } from 'next';

import { PATH } from '@/common/enums';
import styles from './page.module.css';
import { notoSerif } from '@/common/fonts';
import { OrderedList } from '@/components/ordered-page';

export const metadata: Metadata = {
  title: 'Đơn hàng',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

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
