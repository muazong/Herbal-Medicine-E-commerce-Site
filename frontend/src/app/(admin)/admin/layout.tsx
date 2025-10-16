import { Metadata } from 'next';
import { ReactNode } from 'react';

import '@/app/globals.css';
import { roboto } from '@/common/fonts';

export const metadata: Metadata = {
  title: 'Trang quản trị viên - Anvita',
  description: 'Trang quản trị viên của Anvita',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className={roboto.className}>{children}</div>;
}
