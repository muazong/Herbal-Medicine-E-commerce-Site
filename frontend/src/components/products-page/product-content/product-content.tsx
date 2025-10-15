'use client';

import { useEffect } from 'react';
import { IoIosSearch } from 'react-icons/io';

import { roboto } from '@/common/fonts';
import { Products } from '@/components';
import styles from './product-content.module.css';
import { getProducts } from '@/services/products-service';
import { useProductsStore } from '@/stores/products-store';
import { getProductsByCategory } from '@/services/categories-service';

function ProductContent({ categoryId }: { categoryId?: string }) {
  const products = useProductsStore((state) => state.products);
  const setProducts = useProductsStore((state) => state.setProducts);

  useEffect(() => {
    (async () => {
      const products = categoryId
        ? await getProductsByCategory(categoryId, 9)
        : await getProducts(9);
      setProducts(products || []);
    })();
  }, [categoryId, setProducts]);

  return (
    <div className={styles.content}>
      <div className={styles.search}>
        <div className={styles.icon}>
          <IoIosSearch />
          <p>Tìm kiểm</p>
        </div>

        <input
          type="search"
          className={roboto.className}
          placeholder="Tìm kiếm sản phẩm"
        />
      </div>

      <div className={styles.products}>
        {!(products.length > 0) ? (
          <p>Đang tải...</p>
        ) : (
          <Products products={products} />
        )}
      </div>
    </div>
  );
}

export default ProductContent;
