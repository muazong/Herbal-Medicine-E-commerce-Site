'use client';

import Link from 'next/link';
import { PATH } from '@/common/enums';
import styles from './navbar.module.css';
import { usePathname } from 'next/navigation';
import { MouseEvent, useEffect, useRef, useState } from 'react';

function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    const activeLink = navRef.current?.querySelector(
      `.${styles.active}`,
    ) as HTMLElement | null;

    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth,
        opacity: 1,
      });
    }
  }, [pathname]);

  const handleHover = (e: MouseEvent<HTMLElement>) => {
    const { offsetLeft, offsetWidth } = e.target as HTMLElement;
    setUnderlineStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
  };

  const handleLeave = () => {
    const activeLink = navRef.current?.querySelector(
      `.${styles.active}`,
    ) as HTMLElement | null;

    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth,
        opacity: 1,
      });
    } else {
      setUnderlineStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <nav className={styles.container} ref={navRef} onMouseLeave={handleLeave}>
      <ul className={styles.navList}>
        <li>
          <Link
            href={PATH.HOME}
            className={pathname.endsWith(PATH.HOME) ? styles.active : undefined}
            onMouseEnter={handleHover}
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
            onMouseEnter={handleHover}
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
            onMouseEnter={handleHover}
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
            onMouseEnter={handleHover}
          >
            GIỚI THIỆU
          </Link>
        </li>
      </ul>

      <span
        className={styles.underline}
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
          opacity: underlineStyle.opacity,
        }}
      ></span>
    </nav>
  );
}

export default Navbar;
