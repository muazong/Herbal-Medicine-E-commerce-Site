'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { PATH } from '@/common/enums';
import styles from './dashboard-products.module.css';
import formatDayVi from '@/common/lib/format-day-vi';
import { getProducts } from '@/services/products-service';
import { useProductsStore } from '@/stores/products-store';
import { usePaginationStore } from '@/stores/pagination-store';

function DashboardProducts() {
  const products = useProductsStore((state) => state.products);
  const currentPage = usePaginationStore((state) => state.currentPage);
  const setProducts = useProductsStore((state) => state.setProducts);

  useEffect(() => {
    (async () => {
      const products = await getProducts(9, currentPage);
      setProducts(products || []);
    })();
  }, [setProducts, currentPage]);

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Đã bán</th>
            <th>Danh mục</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.empty}>
                Không có sản phẩm nào
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString('vi-VN')}₫</td>
                <td>{product.sold}</td>
                <td>
                  {product.category ? product.category.name : 'Chưa chọn'}
                </td>
                <td>{formatDayVi(product.createdAt, false)}</td>
                <td>{formatDayVi(product.updatedAt, false)}</td>
                <td>
                  <button className={`${styles.btn} ${styles.edit}`}>
                    <Link href={`${PATH.PRODUCTS_MANAGEMENT}/${product.id}`}>
                      Sửa
                    </Link>
                  </button>
                  <button className={`${styles.btn} ${styles.delete}`}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardProducts;
