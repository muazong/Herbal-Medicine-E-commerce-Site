'use client';

import { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

import { roboto } from '@/common/fonts';
import { Products } from '@/components';
import styles from './product-content.module.css';
import { getProducts } from '@/services/products-service';
import { useProductsStore } from '@/stores/products-store';
import {
  getProductsByCategory,
  searchProducts,
} from '@/services/categories-service';

function ProductContent({ categoryId }: { categoryId?: string }) {
  const products = useProductsStore((state) => state.products);
  const setProducts = useProductsStore((state) => state.setProducts);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    (async () => {
      const products = categoryId
        ? await getProductsByCategory(categoryId, 9)
        : await getProducts(9);
      setProducts(products || []);
    })();
  }, [categoryId, setProducts]);

  const handleSearchProducts = async () => {
    const products = await searchProducts(search);
    setProducts(products || []);
  };

  return (
    <div className={styles.content}>
      <div className={styles.search}>
        <button className={styles.icon} onClick={handleSearchProducts}>
          <IoIosSearch />
          <p>Tìm kiểm</p>
        </button>

        <input
          type="search"
          className={roboto.className}
          placeholder="Tìm kiếm sản phẩm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchProducts();
            }
          }}
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
