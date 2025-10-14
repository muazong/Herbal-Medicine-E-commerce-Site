import { Metadata } from 'next';
import styles from './page.module.css';
import { OrderedList } from '@/components/ordered-page';

export const metadata: Metadata = {
  title: 'Đơn hàng đã huỷ',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

function CanceledPage() {
  return (
    <div className={styles.container}>
      <OrderedList canceled />
    </div>
  );
}

export default CanceledPage;
