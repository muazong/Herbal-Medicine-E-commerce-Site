import { IoIosSearch } from 'react-icons/io';

import styles from './page.module.css';
import { roboto } from '@/common/fonts';
import { Products, Title } from '@/components';
import { Sidebar } from '@/components/products-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

function ProductsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.sidebar}>
          <Title text="Danh mục sản phẩm" className={styles.title} />
          <Sidebar />
        </div>
        <div className={styles.content}>
          <div className={styles.search}>
            <div className={styles.icon}>
              <IoIosSearch />
              <p>Tìm kiểm</p>
            </div>

            <input
              type="search"
              className={roboto.className}
              placeholder="Tìm kiếm sản phẩm"
            />
          </div>
          <div className={styles.products}>
            <Products />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
