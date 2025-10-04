import { Metadata } from 'next';

import styles from './page.module.css';
import { Categories, Products } from '@/components';
import { Hero, Propose, TrustBadges } from '@/components/home-page';

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
      <Products title="sản phẩm nổi bật" limit={8} orderBy="sold" />
      <Categories />
      <Products title="Sản phẩm mới nhất" limit={8} orderBy="createdAt" />
      <Propose />
    </div>
  );
}
