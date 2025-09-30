'use client';

import Link from 'next/link';
import { PATH } from '@/common/enums';
import styles from './navbar.module.css';
import { usePathname } from 'next/navigation';

function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.container}>
      <ul className={styles.navList}>
        <li>
          <Link
            href={PATH.HOME}
            className={pathname.endsWith(PATH.HOME) ? styles.active : undefined}
          >
            TRANG CHỦ
          </Link>
        </li>
        <li>
          <Link
            href={PATH.PRODUCTS}
            className={
              pathname.startsWith(PATH.PRODUCTS) ? styles.active : undefined
            }
          >
            SẢN PHẨM
          </Link>
        </li>
        <li>
          <Link
            href={PATH.CONTACT}
            className={
              pathname.startsWith(PATH.CONTACT) ? styles.active : undefined
            }
          >
            LIÊN HỆ
          </Link>
        </li>
        <li>
          <Link
            href={PATH.ABOUT}
            className={
              pathname.startsWith(PATH.ABOUT) ? styles.active : undefined
            }
          >
            GIỚI THIỆU
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
