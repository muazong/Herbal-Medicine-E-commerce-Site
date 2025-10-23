'use client';

import styles from './dashboard-add-product.module.css';

function DashboardAddProductForm() {
  // TODO: here
  return (
    <form className={styles.form}>
      <div className={styles.input}>
        <label htmlFor="productName">Tên sản phẩm</label>
        <input type="text" id="productName" placeholder="Tên sản phẩm" />
      </div>

      <div className={styles.input}>
        <label htmlFor="productPrice">Giá</label>
        <input type="text" id="productPrice" placeholder="Giá sản phẩm" />
      </div>

      <div className={styles.input}>
        <label htmlFor="productStock">Số lượng</label>
        <input type="number" id="productStock" placeholder="Giá sản phẩm" />
      </div>
    </form>
  );
}

export default DashboardAddProductForm;
