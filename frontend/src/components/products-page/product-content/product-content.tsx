'use client';

import { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { IoMenuOutline } from 'react-icons/io5';
import { useSearchParams } from 'next/navigation';

import { roboto } from '@/common/fonts';
import { Products } from '@/components';
import { ProductFilter } from '@/common/types';
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
  const [filter, setFilter] = useState<ProductFilter>('createdAt');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (!categoryId) {
        setSearch('');
      }

      const products = categoryId
        ? await getProductsByCategory(categoryId, 9)
        : await getProducts(9, currentPage, filter);
      setProducts(products || []);
    })();
  }, [filter, categoryId, setProducts, currentPage]);

  const handleSearchProducts = async () => {
    const products = await searchProducts(search);
    setProducts(products || []);
  };

  return (
    <div className={styles.content}>
      <div className={styles.search}>
        <div className={styles.filter}>
          <label>
            <IoMenuOutline className={styles.menuIcon} /> Sắp xếp theo:{' '}
          </label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ProductFilter)}
          >
            <option value="createdAt">Mới nhất</option>
            <option value="price">Giá</option>
            <option value="rating">Đánh giá</option>
            <option value="sold">Số lượng bán</option>
          </select>
        </div>
        <div className={styles.searchBar}>
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
