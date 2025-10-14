import { Metadata } from 'next';

import styles from './page.module.css';
import { OrderedDetail } from '@/components/ordered-page';

export const metadata: Metadata = {
  title: 'Chi tiết Đơn hàng',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

async function OrderedItem({
  params,
}: {
  params: Promise<{ orderedId: string }>;
}) {
  const orderId = (await params).orderedId;
  return (
    <div className={styles.container}>
      <OrderedDetail orderId={orderId} />
    </div>
  );
}

export default OrderedItem;
