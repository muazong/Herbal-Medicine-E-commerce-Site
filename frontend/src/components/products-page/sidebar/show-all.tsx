'use client';

import { usePaginationStore } from '@/stores/pagination-store';
import { useRouter, useSearchParams } from 'next/navigation';

import { PATH } from '@/common/enums';
import styles from './sidebar.module.css';

function ShowAll() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const setCurrentPage = usePaginationStore((state) => state.setCurrentPage);

  const handleShowAll = () => {
    setCurrentPage(1);
    router.push(PATH.PRODUCTS);
  };

  return (
    <li className={styles.item + (categoryId ? '' : ' ' + styles.active)}>
      <button onClick={handleShowAll}>Tất cả</button>
    </li>
  );
}

export default ShowAll;
