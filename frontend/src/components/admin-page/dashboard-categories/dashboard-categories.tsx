'use client';
import Link from 'next/link';
import { useEffect } from 'react';

import { shortDesc } from '@/common/lib/short-desc';
import formatDayVi from '@/common/lib/format-day-vi';
import styles from './dashboard-categories.module.css';
import { useCategoryStore } from '@/stores/category-store';
import {
  deleteCategory,
  getCategories,
  getCategoriesPages,
} from '@/services/categories-service';
import { toast } from 'sonner';
import { usePaginationStore } from '@/stores/pagination-store';

function DashboardCategories() {
  const categories = useCategoryStore((state) => state.categories);
  const setCategories = useCategoryStore((state) => state.setCategories);
  const deleteCategoryStore = useCategoryStore((state) => state.deleteCategory);
  const currentPage = usePaginationStore((state) => state.currentPage);
  const setPages = usePaginationStore((state) => state.setPages);

  useEffect(() => {
    (async () => {
      const categories = await getCategories(9, currentPage);
      setCategories(categories || []);
    })();
  }, [setCategories, currentPage]);

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const result = await deleteCategory(categoryId);
      if (result) {
        deleteCategoryStore(categoryId);
        toast.success('Danh mục đã được xóa thành công');

        const pages = await getCategoriesPages();
        setPages(pages || 1);

        const categories = await getCategories(9, currentPage);
        setCategories(categories || []);
      }
    } catch {
      toast.error('Lỗi trong quá trình xoá danh mục');
    }
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.empty}>
                Không có danh mục nào
              </td>
            </tr>
          ) : (
            categories.map((category, index) => (
              <tr key={category.id}>
                <td>
                  {currentPage === 1
                    ? index + 1
                    : index + 1 + 9 * (currentPage - 1)}
                </td>
                <td>{category.name}</td>
                <td>{shortDesc(category.description, 12)}</td>
                <td>{formatDayVi(category.createdAt, false)}</td>
                <td>{formatDayVi(category.updatedAt, false)}</td>
                <td className={styles.actions}>
                  <button className={`${styles.btn} ${styles.edit}`}>
                    <Link href="">Sửa</Link>
                  </button>
                  <button
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => handleDeleteCategory(category.id)}
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

export default DashboardCategories;
