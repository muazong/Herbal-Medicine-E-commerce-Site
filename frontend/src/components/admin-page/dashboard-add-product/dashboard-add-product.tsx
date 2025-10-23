'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

import styles from './dashboard-add-product.module.css';
import { createProduct } from '@/services/products-service';

function DashboardAddProductForm() {
  const [images, setImages] = useState<string[]>([]);

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
        toast.success('Sản phẩm đã được tạo thành công');
      }
    } catch {
      toast.error('Lỗi khi tạo sản phẩm');
    }
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

      <button type="submit">Thêm sản phẩm</button>
    </form>
  );
}

export default DashboardAddProductForm;
