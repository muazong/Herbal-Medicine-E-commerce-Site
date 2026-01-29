'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import styles from './page.module.css';
import { PATH } from '@/common/enums';
import { DashboardBreadcrumb, DashboardTitle } from '@/components/admin-page';
import { getCategoryById, updateCategory } from '@/services/categories-service';

interface Category {
  id: string;
  name: string;
  description?: string;
}

function EditCategoryPage() {
  const router = useRouter();
  const params = useSearchParams();
  const categoryId = params.get('categoryId') as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===================== FETCH CATEGORY ===================== */
  useEffect(() => {
    console.log(categoryId);
    getCategoryById(categoryId).then(setCategory);
  }, [categoryId]);

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const result = await updateCategory(categoryId, name, description);

    setLoading(false);

    if (!result) {
      toast.error('Cập nhật danh mục thất bại');
      return;
    }

    toast.success('Cập nhật danh mục thành công');
    router.push(PATH.CATEGORIES_MANAGEMENT);
  };

  if (!category) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <DashboardTitle title="Chỉnh sửa danh mục sản phẩm" />
      <DashboardBreadcrumb
        parenTitle="Quản lý danh mục"
        parentHref={PATH.CATEGORIES_MANAGEMENT}
        childTitle="Chỉnh sửa danh mục"
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* NAME */}
        <div className={styles.input}>
          <label htmlFor="name">Tên danh mục</label>
          <input id="name" name="name" defaultValue={category.name} required />
        </div>

        {/* DESCRIPTION */}
        <div className={styles.input}>
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            defaultValue={category.description}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập nhật danh mục'}
        </button>
      </form>
    </div>
  );
}

export default EditCategoryPage;
