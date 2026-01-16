import { Metadata } from 'next';

import styles from './page.module.css';
import { DashboardTitle, DashboardUsers } from '@/components/admin-page';

export const metadata: Metadata = {
  title: 'Quản lý người dùng - Quản lý Anvita',
  description: 'Quản lý người dùng của Anvita',
};

function UsersDashboardPage() {
  return (
    <div>
      <div className={styles.title}>
        <DashboardTitle title="Quản lý người dùng" />
      </div>
      <DashboardUsers />
      {/* <Pagination pagesFromServer={pages} theme="secondary" /> */}
    </div>
  );
}

export default UsersDashboardPage;
