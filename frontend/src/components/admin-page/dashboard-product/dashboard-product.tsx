'use client';

import Link from 'next/link';

import { PATH } from '@/common/enums';
import styles from './dashboard-product.module.css';
import DashboardTitle from '../dashboard-title/dashboard-title';
import DashboardProductForm from '../dashboard-product-form/dashboard-product-form';

function DashboardProduct({ productId }: { productId: string }) {
  return (
    <div>
      <DashboardTitle title="Cập nhật sản phẩm" />
      <div className={styles.breadcrumb}>
        <Link href={PATH.PRODUCTS_MANAGEMENT}>Quản lý sản phẩm</Link>
        <span> \ </span>
        <p>Cập nhật sản phẩm</p>
      </div>

      <DashboardProductForm productId={productId} type="edit" />
    </div>
  );
}

export default DashboardProduct;
