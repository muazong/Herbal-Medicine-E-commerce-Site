import { Metadata } from 'next';
import Content from './content';

export const metadata: Metadata = {
  title: 'Quản lý người dùng - Quản lý Anvita',
  description: 'Quản lý người dùng của Anvita',
};

function UsersDashboardPage() {
  return <Content />;
}

export default UsersDashboardPage;
