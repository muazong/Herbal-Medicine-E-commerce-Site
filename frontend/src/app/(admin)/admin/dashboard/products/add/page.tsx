import Link from 'next/link';

import { PATH } from '@/common/enums';
import styles from './page.module.css';
import { DashboardTitle } from '@/components/admin-page';
import { DashboardProductForm } from '@/components/admin-page';

function AddProductPage() {
  return (
    <div className={styles.container}>
      <DashboardTitle title="Thêm sản phẩm" />
      <div className={styles.breadcrumb}>
        <Link href={PATH.PRODUCTS_MANAGEMENT}>Quản lý sản phẩm</Link>
        <span> \ </span>
        <p>Thêm sản phẩm</p>
      </div>

      <DashboardProductForm type="create" />
    </div>
  );
}

export default AddProductPage;
