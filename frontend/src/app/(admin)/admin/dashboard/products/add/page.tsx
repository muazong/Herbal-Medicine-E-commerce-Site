import { PATH } from '@/common/enums';
import styles from './page.module.css';
import { DashboardProductForm } from '@/components/admin-page';
import { DashboardBreadcrumb, DashboardTitle } from '@/components/admin-page';

function AddProductPage() {
  return (
    <div className={styles.container}>
      <DashboardTitle title="Thêm sản phẩm" />
      <DashboardBreadcrumb
        parenTitle="Quản lý sản phẩm"
        parentHref={PATH.PRODUCTS_MANAGEMENT}
        childTitle="Thêm sản phẩm"
      />

      <DashboardProductForm type="create" />
    </div>
  );
}

export default AddProductPage;
