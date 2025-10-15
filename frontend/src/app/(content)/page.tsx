import { Metadata } from 'next';

import {
  Hero,
  Propose,
  TrustBadges,
  NewestProducts,
  OutstandingProducts,
} from '@/components/home-page';
import styles from './page.module.css';
import { Categories } from '@/components';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Home() {
  return (
    <div className={styles.container}>
      <Hero />
      <TrustBadges />
      <OutstandingProducts />
      <Categories />
      <NewestProducts />
      <Propose />
    </div>
  );
}
