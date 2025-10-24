'use client';

import { PATH } from '@/common/enums';
import DashboardTitle from '../dashboard-title/dashboard-title';
import DashboardBreadcrumb from '../dashboard-breadcrumb/dashboard-breadcrumb';
import DashboardProductForm from '../dashboard-product-form/dashboard-product-form';

function DashboardProduct({ productId }: { productId: string }) {
  return (
    <div>
      <DashboardTitle title="Cập nhật sản phẩm" />
      <DashboardBreadcrumb
        parenTitle="Quản lý sản phẩm"
        parentHref={PATH.PRODUCTS_MANAGEMENT}
        childTitle="Cập nhật sản phẩm"
      />

      <DashboardProductForm productId={productId} type="edit" />
    </div>
  );
}

export default DashboardProduct;
