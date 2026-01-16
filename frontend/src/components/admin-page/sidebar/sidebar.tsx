'use client';

import Link from 'next/link';
import { IoMdCart } from 'react-icons/io';
import { MdCategory } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { AiFillProduct } from 'react-icons/ai';
import { FaHome, FaUserCircle } from 'react-icons/fa';

import { PATH } from '@/common/enums';
import styles from './sidebar.module.css';
import Title from '@/components/title/title';

const routes = [
  {
    id: 'dashboard',
    name: 'Tổng quan',
    href: PATH.DASHBOARD,
    icon: FaHome,
  },
  {
    id: 'users',
    name: 'Quản lý người dùng',
    href: PATH.USERS_MANAGEMENT,
    icon: FaUserCircle,
  },
  {
    id: 'products',
    name: 'Quản lý sản phẩm',
    href: PATH.PRODUCTS_MANAGEMENT,
    icon: AiFillProduct,
  },
  {
    id: 'categories',
    name: 'Quản lý danh mục sản phẩm',
    href: PATH.CATEGORIES_MANAGEMENT,
    icon: MdCategory,
  },
  {
    id: 'orders',
    name: 'Quản lý đơn hàng',
    href: PATH.ORDERS_MANAGEMENT,
    icon: IoMdCart,
  },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.container}>
      <Title text="Quản lý Anvita" className={styles.title} />

      <ul className={styles.list}>
        {routes.map((route) => {
          let isActive = false;

          if (route.id === 'dashboard') {
            isActive = pathname === route.href;
          } else {
            isActive =
              pathname === route.href || pathname.startsWith(`${route.href}/`);
          }

          return (
            <li key={route.id}>
              <Link href={route.href} className={isActive ? styles.active : ''}>
                <route.icon className={styles.icon} />
                {route.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
