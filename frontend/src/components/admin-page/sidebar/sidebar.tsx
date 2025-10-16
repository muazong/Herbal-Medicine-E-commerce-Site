import Link from 'next/link';
import { FaHome, FaUserCircle } from 'react-icons/fa';
import { AiFillProduct } from 'react-icons/ai';
import { MdCategory } from 'react-icons/md';

import { PATH } from '@/common/enums';
import styles from './sidebar.module.css';
import Title from '@/components/title/title';

function Sidebar() {
  return (
    <aside className={styles.container}>
      <Title text="Quản lý Anvita" className={styles.title} />

      <ul className={styles.list}>
        <li>
          <Link href={PATH.DASHBOARD}>
            <FaHome className={styles.icon} />
            Tổng quan
          </Link>
        </li>
        <li>
          <Link href={PATH.USERS_MANAGEMENT}>
            <FaUserCircle className={styles.icon} />
            Quản lý người dùng
          </Link>
        </li>
        <li>
          <Link href={PATH.PRODUCTS_MANAGEMENT}>
            <AiFillProduct className={styles.icon} />
            Quản lý sản phẩm
          </Link>
        </li>
        <li>
          <Link href={PATH.CATEGORIES_MANAGEMENT}>
            <MdCategory className={styles.icon} />
            Quản lý danh mục sản phẩm
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
