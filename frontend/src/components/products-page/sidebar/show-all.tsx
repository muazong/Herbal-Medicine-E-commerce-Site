'use client';

import { useRouter } from 'next/navigation';

import { PATH } from '@/common/enums';
import styles from './sidebar.module.css';
import { usePaginationStore } from '@/stores/pagination-store';

function ShowAll() {
  const router = useRouter();
  const setCurrentPage = usePaginationStore((state) => state.setCurrentPage);

  const handleShowAll = () => {
    setCurrentPage(1);
    router.push(PATH.PRODUCTS);
  };

  return (
    <li className={styles.item}>
      <button onClick={handleShowAll}>Tất cả</button>
    </li>
  );
}

export default ShowAll;
