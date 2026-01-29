'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';

import { PATH } from '@/common/enums';
import styles from './page.module.css';
import { DashboardBreadcrumb, DashboardTitle } from '@/components/admin-page';
import {
  addImagesToCategory,
  createCategory,
} from '@/services/categories-service';

function AddCategoryPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  /* ===================== CREATE CATEGORY ===================== */
  const handleCreateCategory = async (formData: FormData) => {
    const categoryName = formData.get('categoryName') as string;
    const categoryDescription = formData.get('categoryDescription') as string;

    try {
      return await createCategory({
        name: categoryName,
        description: categoryDescription,
      });
    } catch {
      toast.error('Lỗi khi tạo danh mục');
      return null;
    }
  };

  /* ===================== UPLOAD IMAGE ===================== */
  const handleUploadImage = async (categoryId: string, formData: FormData) => {
    const file = formData.get('categoryImage') as File | null;
    if (!file) return;

    const fileFormData = new FormData();
    fileFormData.append('file', file);

    await addImagesToCategory(categoryId, fileFormData);
  };

  /* ===================== IMAGE CHANGE ===================== */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newCategory = await handleCreateCategory(formData);

    if (!newCategory) return;

    await handleUploadImage(newCategory.id, formData);

    toast.success('Tạo danh mục thành công');
    router.push(PATH.CATEGORIES_MANAGEMENT);
  };

  return (
    <div className={styles.container}>
      <DashboardTitle title="Thêm danh mục sản phẩm" />
      <DashboardBreadcrumb
        parenTitle="Quản lý danh mục"
        parentHref={PATH.CATEGORIES_MANAGEMENT}
        childTitle="Thêm danh mục sản phẩm"
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* NAME */}
        <div className={styles.input}>
          <label htmlFor="categoryName">Tên danh mục sản phẩm</label>
          <input
            type="text"
            name="categoryName"
            id="categoryName"
            placeholder="Tên danh mục sản phẩm"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className={styles.input}>
          <label htmlFor="categoryDescription">Mô tả</label>
          <textarea
            id="categoryDescription"
            name="categoryDescription"
            placeholder="Mô tả danh mục"
          />
        </div>

        {/* IMAGE */}
        <div className={styles.input}>
          <label>Ảnh danh mục sản phẩm</label>

          <label htmlFor="categoryImage" className={styles.uploadBtn}>
            + Thêm ảnh
          </label>

          <input
            type="file"
            id="categoryImage"
            name="categoryImage"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.hiddenFile}
          />
        </div>

        {/* IMAGE PREVIEW */}
        {image && (
          <div className={styles.imagePreview}>
            <div className={styles.imageItem}>
              <Image src={image} alt="Ảnh danh mục" fill sizes="200px" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className={styles.removeBtn}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <button type="submit" className={styles.submitBtn}>
          Thêm danh mục sản phẩm
        </button>
      </form>
    </div>
  );
}

export default AddCategoryPage;
