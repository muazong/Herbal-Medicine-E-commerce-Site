import { Metadata } from 'next';

import styles from './page.module.css';
import { Pagination, Sidebar } from '@/components/products-page';
import { ProductContent } from '@/components/products-page';

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

async function ProductsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Sidebar />
        <ProductContent />
      </div>
      <Pagination />
    </div>
  );
}

export default ProductsPage;
