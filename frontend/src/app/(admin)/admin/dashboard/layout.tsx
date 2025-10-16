import { ReactNode } from 'react';

import styles from './layout.module.css';
import { Sidebar } from '@/components/admin-page';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
