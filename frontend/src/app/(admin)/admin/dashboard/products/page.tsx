import { use } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

import { PATH } from '@/common/enums';
import styles from './page.module.css';
import { Pagination } from '@/components/products-page';
import { getProductsPages } from '@/services/products-service';
import { DashboardTitle, DashboardProducts } from '@/components/admin-page';

export const metadata: Metadata = {
  title: 'Quản lý sản phẩm',
};

function ProductsDashboard() {
  const pages = use(getProductsPages());

  return (
    <div>
      <div className={styles.title}>
        <DashboardTitle title="Quản lý sản phẩm" />
        <Link href={PATH.ADD_PRODUCT}>Thêm sản phẩm</Link>
      </div>
      <DashboardProducts />
      <Pagination pagesFromServer={pages} theme="secondary" />
    </div>
  );
}

export default ProductsDashboard;
