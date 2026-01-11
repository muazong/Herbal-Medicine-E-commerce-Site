import Link from 'next/link';
import { Metadata } from 'next';

import { PATH } from '@/common/enums';
import styles from './page.module.css';
import { DashboardCategories, DashboardTitle } from '@/components/admin-page';

export const metadata: Metadata = {
  title: 'Quản lý danh mục sản phẩm - Quản lý Anvita',
  description: 'Quản lý danh mục sản phẩm của Anvita',
};

function CategoriesDashboard() {
  return (
    <div>
      <div className={styles.title}>
        <DashboardTitle title="Quản lý danh mục sản phẩm" />
        <Link href={PATH.ADD_CATEGORY}>Thêm danh mục sản phẩm</Link>
      </div>
      <DashboardCategories />
      {/* <Pagination pagesFromServer={pages} theme="secondary" /> */}
    </div>
  );
}

export default CategoriesDashboard;
