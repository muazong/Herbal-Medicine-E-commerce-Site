'use client';

import { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { useSearchParams } from 'next/navigation';

import { roboto } from '@/common/fonts';
import { Products } from '@/components';
import styles from './product-content.module.css';
import { useProductsStore } from '@/stores/products-store';
import { usePaginationStore } from '@/stores/pagination-store';
import { getProductsByCategory } from '@/services/categories-service';
import { getProducts, searchProducts } from '@/services/products-service';

function ProductContent() {
  const categoryId = useSearchParams().get('categoryId') || null;
  const currentPage = usePaginationStore((state) => state.currentPage);
  const products = useProductsStore((state) => state.products);
  const setProducts = useProductsStore((state) => state.setProducts);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (!categoryId) {
        setSearch('');
      }

      const products = categoryId
        ? await getProductsByCategory(categoryId, 9)
        : await getProducts(9, currentPage);
      setProducts(products || []);
    })();
  }, [categoryId, setProducts, currentPage]);

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
          <p>Không có sản phẩm nào.</p>
        ) : (
          <Products products={products} />
        )}
      </div>
    </div>
  );
}

export default ProductContent;
