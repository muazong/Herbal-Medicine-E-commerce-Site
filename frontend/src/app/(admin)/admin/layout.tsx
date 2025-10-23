import { Metadata } from 'next';
import { ReactNode } from 'react';

import '@/app/globals.css';
import { roboto } from '@/common/fonts';
import styles from './layout.module.css';
import AdminGuard from '@/common/guards/admin-guard';
import { ToasterWrapper } from '@/components/toaster';

export const metadata: Metadata = {
  title: 'Trang quản trị viên - Anvita',
  description: 'Trang quản trị viên của Anvita',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className={styles.container + ' ' + roboto.className}>
        <ToasterWrapper>{children}</ToasterWrapper>
      </div>
    </AdminGuard>
  );
}
