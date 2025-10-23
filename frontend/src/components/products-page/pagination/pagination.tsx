'use client';

import { useEffect } from 'react';
import styles from './pagination.module.css';
import { usePaginationStore } from '@/stores/pagination-store';

function Pagination({
  pagesFromServer,
  theme = 'primary',
}: {
  pagesFromServer: number | null;
  theme?: 'primary' | 'secondary';
}) {
  const pages = usePaginationStore((state) => state.pages);
  const currentPage = usePaginationStore((state) => state.currentPage);
  const setPages = usePaginationStore((state) => state.setPages);
  const setCurrentPage = usePaginationStore((state) => state.setCurrentPage);

  useEffect(() => {
    setPages(pagesFromServer || 1);
    setCurrentPage(1);
  }, [setPages, setCurrentPage, pagesFromServer]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.container}>
      <ul className={styles.pagination}>
        {Array.from({ length: pages }, (_, i) => i + 1).map((page) => {
          const isActive = currentPage === page;
          return (
            <li
              key={page}
              onClick={() => handlePageChange(page)}
              className={`${styles.item} ${isActive ? styles.active + ' ' + styles[theme] : ''}`}
            >
              {page}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Pagination;
