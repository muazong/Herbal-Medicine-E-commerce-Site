import { Metadata } from 'next';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

function AboutPage() {
  return (
    <div className={styles.container}>
      <h1>Về chúng tôi</h1>
    </div>
  );
}

export default AboutPage;
