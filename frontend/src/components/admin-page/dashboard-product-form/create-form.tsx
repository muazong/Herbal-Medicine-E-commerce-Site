'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import { PATH } from '@/common/enums';
import { FaTimes } from 'react-icons/fa';

import { useRouter } from 'next-nprogress-bar';
import { Category } from '@/common/interfaces';
import styles from './dashboard-product-form.module.css';
import { assignCategoryToProduct } from '@/services/categories-service';
import { addProductImages, createProduct } from '@/services/products-service';

function CreateForm({ categories }: { categories: Category[] | null }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const handleCreateProduct = async (formData: FormData) => {
    const productName = formData.get('productName') as string;
    const productPrice = formData.get('productPrice') as string;
    const productStock = formData.get('productStock') as string;
    const productDescription = formData.get('productDescription') as string;

    const product = {
      name: productName,
      price: Number(productPrice),
      stock: Number(productStock),
      description: productDescription,
    };

    try {
      const newProduct = await createProduct(product);
      if (newProduct) {
        const categoryId = formData.get('productCategoryId') as string;
        if (categoryId) {
          const result = await assignCategoryToProduct(
            newProduct.id,
            categoryId,
          );
          if (result) {
            toast.success('Sản phẩm đã được tạo thành công');
          }
        } else {
          toast.success('Sản phẩm đã được tạo thành công');
        }

        return newProduct;
      }
      return null;
    } catch {
      toast.error('Lỗi khi tạo sản phẩm');
      return null;
    }
  };
  const handleAddImage = async (productId: string, formData: FormData) => {
    const images = formData.getAll('productImages') as File[];

    if (images.length > 0) {
      const filesFormData = new FormData();

      images.forEach((image) => {
        filesFormData.append('files', image);
      });

      const result = await addProductImages(productId, filesFormData);
      if (result) {
        return;
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );
    setImages((prev) => [...prev, ...newImages]);
  };
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct = await handleCreateProduct(formData);
    if (newProduct !== null) await handleAddImage(newProduct.id, formData);

    router.push(PATH.PRODUCTS_MANAGEMENT);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.input}>
        <label htmlFor="productName">Tên sản phẩm</label>
        <input
          type="text"
          name="productName"
          id="productName"
          placeholder="Tên sản phẩm"
        />
      </div>

      <div className={styles.input}>
        <label htmlFor="productPrice">Giá</label>
        <input
          type="text"
          name="productPrice"
          id="productPrice"
          placeholder="Giá sản phẩm"
        />
      </div>

      <div className={styles.input}>
        <label htmlFor="productStock">Số lượng</label>
        <input
          type="number"
          id="productStock"
          name="productStock"
          placeholder="Số lượng sản phẩm"
        />
      </div>

      <div className={styles.input}>
        <label htmlFor="productDescription">Mô tả</label>
        <textarea
          id="productDescription"
          name="productDescription"
          placeholder="Mô tả sản phẩm"
        ></textarea>
      </div>

      <div className={styles.input}>
        <label>Loại sản phẩm</label>
        <select name="productCategoryId" id="productCategoryId">
          <option value="">Chọn loại sản phẩm</option>
          {categories &&
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.input}>
        <label>Ảnh sản phẩm</label>
        <label htmlFor="productImages" className={styles.uploadBtn}>
          + Thêm ảnh
        </label>
        <input
          type="file"
          id="productImages"
          name="productImages"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className={styles.hiddenFile}
        />
      </div>

      {images.length > 0 && (
        <div className={styles.imagePreview}>
          {images.map((src, index) => (
            <div key={index} className={styles.imageItem}>
              <Image src={src} alt={`Ảnh ${index + 1}`} fill />
              <button type="button" onClick={() => handleRemoveImage(index)}>
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="submit" className={styles.submitBtn}>
        Thêm sản phẩm
      </button>
    </form>
  );
}

export default CreateForm;
