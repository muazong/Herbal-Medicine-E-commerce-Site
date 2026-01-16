'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

import {
  getProducts,
  deleteProduct,
  getProductsPages,
} from '@/services/products-service';
import { PATH } from '@/common/enums';
import { swal_fire } from '@/common/lib/swal';
import { shortDesc } from '@/common/lib/short-desc';
import styles from './dashboard-products.module.css';
import formatDayVi from '@/common/lib/format-day-vi';
import formatCurrency from '@/common/lib/format-currency';
import { useProductsStore } from '@/stores/products-store';
import { usePaginationStore } from '@/stores/pagination-store';

function DashboardProducts() {
  const products = useProductsStore((state) => state.products);
  const currentPage = usePaginationStore((state) => state.currentPage);
  const setPages = usePaginationStore((state) => state.setPages);
  const setProducts = useProductsStore((state) => state.setProducts);
  const deleteProductStore = useProductsStore((state) => state.deleteProduct);

  useEffect(() => {
    (async () => {
      const products = await getProducts(9, currentPage);
      setProducts(products || []);
    })();
  }, [setProducts, currentPage]);

  const handleDeleteProduct = async (productId: string) => {
    swal_fire('Bạn có chắc chắn xoá sản phẩm này không?').then(
      async (result) => {
        if (result.isConfirmed) {
          const res = await deleteProduct(productId);
          if (res) {
            deleteProductStore(productId);
            toast.success('Sản phẩm đã được xóa thành công');

            const pages = await getProductsPages();
            setPages(pages || 1);

            const products = await getProducts(9, currentPage);
            setProducts(products || []);
          } else {
            toast.error('Xóa sản phẩm thất bại!');
          }
        }
      },
    );
  };

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
                <td>
                  {currentPage === 1
                    ? index + 1
                    : index + 1 + 9 * (currentPage - 1)}
                </td>
                <td>{shortDesc(product.name, 4)}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.sold}</td>
                <td>
                  {product.category ? product.category.name : 'Chưa chọn'}
                </td>
                <td>{formatDayVi(product.createdAt, false)}</td>
                <td>{formatDayVi(product.updatedAt, false)}</td>
                <td className={styles.actions}>
                  <button className={`${styles.btn} ${styles.edit}`}>
                    <Link href={`${PATH.PRODUCTS_MANAGEMENT}/${product.id}`}>
                      Sửa
                    </Link>
                  </button>
                  <button
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => handleDeleteProduct(product.id)}
                  >
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
