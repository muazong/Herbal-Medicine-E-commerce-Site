'use client';
import { useEffect, useState } from 'react';

import styles from './page.module.css';
import { getUsersPages } from '@/services/user-service';
import { Pagination } from '@/components/products-page';
import { DashboardTitle, DashboardUsers } from '@/components/admin-page';

function Content() {
  const [pages, setPages] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const pages = await getUsersPages();
      setPages(pages || 1);
    })();
  }, [setPages]);

  return (
    <div>
      <div className={styles.title}>
        <DashboardTitle title="Quản lý người dùng" />
      </div>
      <DashboardUsers />
      <Pagination pagesFromServer={pages} theme="secondary" />
    </div>
  );
}

export default Content;
