import { use } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

import { PATH } from '@/common/enums';
import styles from './page.module.css';
import { Pagination } from '@/components/products-page';
import { getCategoriesPages } from '@/services/categories-service';
import { DashboardCategories, DashboardTitle } from '@/components/admin-page';

export const metadata: Metadata = {
  title: 'Quản lý danh mục sản phẩm - Quản lý Anvita',
  description: 'Quản lý danh mục sản phẩm của Anvita',
};

function CategoriesDashboard() {
  const pages = use(getCategoriesPages());

  return (
    <div>
      <div className={styles.title}>
        <DashboardTitle title="Quản lý danh mục sản phẩm" />
        <Link href={PATH.ADD_CATEGORY}>Thêm danh mục sản phẩm</Link>
      </div>
      <DashboardCategories />
      <Pagination pagesFromServer={pages} theme="secondary" />
    </div>
  );
}

export default CategoriesDashboard;
