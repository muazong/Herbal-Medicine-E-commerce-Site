'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { env } from '@/common/config';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import {
  getProduct,
  updateProduct,
  UpdateProduct,
} from '@/services/products-service';
import { Category, Product } from '@/common/interfaces';
import styles from './dashboard-product-form.module.css';
import {
  assignCategoryToProduct,
  unssignCategoryToProduct,
} from '@/services/categories-service';
import { useRouter } from 'next-nprogress-bar';
import { PATH } from '@/common/enums';

function EditForm({
  productId,
  categories,
}: {
  productId: string;
  categories: Category[] | null;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    (async () => {
      const product = await getProduct(productId);
      setProduct(product || null);
    })();
  }, [productId]);

  if (!product) return <p>Không có sản phẩm nào</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProduct = await handleUpdateProduct(formData);

    router.push(PATH.PRODUCTS_MANAGEMENT);
  };

  const handleUpdateProduct = async (formData: FormData) => {
    const product: UpdateProduct = {
      name: formData.get('productName') as string,
      price: Number(formData.get('productPrice') as string),
      stock: Number(formData.get('productStock') as string),
      description: formData.get('productDescription') as string,
    };

    try {
      const updatedProduct = await updateProduct(productId, product);

      if (updatedProduct) {
        const categoryId = formData.get('productCategoryId') as string;

        if (categoryId === '') {
          const result = await unssignCategoryToProduct(updatedProduct.id);
          if (result) {
            toast.success('Cập nhật sản phẩm thành công');
            setProduct(updatedProduct);
          }
        } else if (categoryId) {
          const result = await assignCategoryToProduct(
            updatedProduct.id,
            categoryId,
          );
          if (result) {
            toast.success('Cập nhật sản phẩm thành công');
            setProduct(updatedProduct);
          }
        } else {
          toast.success('Cập nhật sản phẩm thành công');
          setProduct(updatedProduct);
        }
        return updatedProduct;
      }
    } catch {
      toast.error('Lỗi cập nhật sản phẩm');
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
          defaultValue={product.name}
        />
      </div>

      <div className={styles.input}>
        <label htmlFor="productPrice">Giá</label>
        <input
          type="text"
          name="productPrice"
          id="productPrice"
          placeholder="Giá sản phẩm"
          defaultValue={product.price}
        />
      </div>

      <div className={styles.input}>
        <label htmlFor="productStock">Số lượng</label>
        <input
          type="number"
          id="productStock"
          name="productStock"
          defaultValue={product.stock}
          placeholder="Số lượng sản phẩm"
        />
      </div>

      <div className={styles.input}>
        <label htmlFor="productDescription">Mô tả</label>
        <textarea
          id="productDescription"
          name="productDescription"
          placeholder="Mô tả sản phẩm"
          defaultValue={product.description}
        ></textarea>
      </div>

      <div className={styles.input}>
        <label>Loại sản phẩm</label>
        <select
          name="productCategoryId"
          id="productCategoryId"
          defaultValue={product.category?.id}
        >
          {product.category?.id && <option value="">Không chọn</option>}
          <option value={product.category?.id}>
            {product.category?.name || 'Chưa chọn'}
          </option>
          {categories &&
            categories.map((category) => {
              if (category.id === product.category?.id) return null;
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
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
          // onChange={handleImageChange}
          className={styles.hiddenFile}
        />
      </div>

      {product.media.length > 0 && (
        <div className={styles.imagePreview}>
          {product.media.map((image, index) => (
            <div key={index} className={styles.imageItem}>
              <Image
                src={`${env.SERVER_URL}${image.path}`}
                alt={image.filename}
                fill
              />
              <button type="button">
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="submit">Cập nhật sản phẩm</button>
    </form>
  );
}

export default EditForm;
