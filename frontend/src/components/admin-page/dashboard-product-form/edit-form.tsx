'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { env } from '@/common/config';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next-nprogress-bar';

import {
  addProductImages,
  getProduct,
  updateProduct,
  UpdateProduct,
} from '@/services/products-service';
import { PATH } from '@/common/enums';
import {
  assignCategoryToProduct,
  unssignCategoryToProduct,
} from '@/services/categories-service';
import { Category, Product } from '@/common/interfaces';
import styles from './dashboard-product-form.module.css';

function EditForm({
  productId,
  categories,
}: {
  productId: string;
  categories: Category[] | null;
}) {
  const router = useRouter();
  const [imagesLength, setImagesLength] = useState<number>(0);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [oldImagesToKeep, setOldImagesToKeep] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const product = await getProduct(productId);
      if (product) {
        setProduct(product);
        setImagesLength(product.media.length);
        setOldImagesToKeep(product.media.map((m) => m.id));
      }
    })();
  }, [productId]);

  if (!product) return <p>Không có sản phẩm nào</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedProduct = await handleUpdateProduct(formData);
    if (!updatedProduct) return;

    if (imagesLength > 0) {
      await handleAddImage(updatedProduct.id, formData);
    }
    router.push(PATH.PRODUCTS_MANAGEMENT);
  };

  const handleUpdateProduct = async (formData: FormData) => {
    const productData: UpdateProduct = {
      name: formData.get('productName') as string,
      price: Number(formData.get('productPrice')),
      stock: Number(formData.get('productStock')),
      description: formData.get('productDescription') as string,
    };

    try {
      const updatedProduct = await updateProduct(productId, productData);
      if (!updatedProduct) throw new Error('Cập nhật thất bại');

      const categoryId = formData.get('productCategoryId') as string;

      if (categoryId === '') {
        await unssignCategoryToProduct(updatedProduct.id);
      } else if (categoryId) {
        await assignCategoryToProduct(updatedProduct.id, categoryId);
      }

      toast.success('Cập nhật sản phẩm thành công');
      setProduct(updatedProduct);
      return updatedProduct;
    } catch {
      toast.error('Lỗi cập nhật sản phẩm');
      return null;
    }
  };

  const handleAddImage = async (productId: string, formData: FormData) => {
    const images = formData.getAll('productImages') as File[];

    if (images.length > 0) {
      const filesFormData = new FormData();
      images.forEach((img) => filesFormData.append('files', img));

      const result = await addProductImages(productId, filesFormData);
      if (result) toast.success('Cập nhật ảnh sản phẩm thành công');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const handleRemovePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveOldImage = (index: number) => {
    const mediaId = product?.media[index].id;
    if (!mediaId) return;

    setOldImagesToKeep((prev) => prev.filter((id) => id !== mediaId));
    setProduct((prev) => {
      if (!prev) return prev;
      const newMedia = prev.media.filter((_, i) => i !== index);
      return { ...prev, media: newMedia };
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* ===== INPUTS ===== */}
      <div className={styles.input}>
        <label htmlFor="productName">Tên sản phẩm</label>
        <input
          type="text"
          name="productName"
          id="productName"
          defaultValue={product.name}
          placeholder="Tên sản phẩm"
        />
      </div>

      <div className={styles.input}>
        <label htmlFor="productPrice">Giá</label>
        <input
          type="number"
          name="productPrice"
          id="productPrice"
          defaultValue={product.price}
          placeholder="Giá sản phẩm"
        />
      </div>

      <div className={styles.input}>
        <label htmlFor="productStock">Số lượng</label>
        <input
          type="number"
          name="productStock"
          id="productStock"
          defaultValue={product.stock}
          placeholder="Số lượng sản phẩm"
        />
      </div>

      <div className={styles.input}>
        <label htmlFor="productDescription">Mô tả</label>
        <textarea
          name="productDescription"
          id="productDescription"
          defaultValue={product.description}
          placeholder="Mô tả sản phẩm"
        />
      </div>

      <div className={styles.input}>
        <label>Loại sản phẩm</label>
        <select
          name="productCategoryId"
          id="productCategoryId"
          defaultValue={product.category?.id || ''}
        >
          <option value="">{product.category?.name || 'Chưa chọn'}</option>
          {categories?.map((category) => (
            <option
              key={category.id}
              value={category.id}
              disabled={category.id === product.category?.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* ===== UPLOAD ẢNH ===== */}
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

      {/* ===== HIỂN THỊ ẢNH ===== */}
      {(product.media.length > 0 || previewImages.length > 0) && (
        <div className={styles.imagePreview}>
          {/* ẢNH CŨ */}
          {product.media.map((img, index) => (
            <div key={`old-${img.id}`} className={styles.imageItem}>
              <Image
                src={`${env.SERVER_URL}${img.path}`}
                alt={img.filename}
                fill
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={() => handleRemoveOldImage(index)}
                className={styles.removeBtn}
              >
                <FaTimes />
              </button>
            </div>
          ))}

          {/* ẢNH MỚI */}
          {previewImages.map((img, index) => (
            <div key={`new-${index}`} className={styles.imageItem}>
              <Image
                src={img}
                alt={`preview-${index}`}
                fill
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={() => handleRemovePreviewImage(index)}
                className={styles.removeBtn}
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="submit" className={styles.submitBtn}>
        Cập nhật sản phẩm
      </button>
    </form>
  );
}

export default EditForm;
