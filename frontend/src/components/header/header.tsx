import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart } from 'react-icons/fa';

import { notoSerif } from '@/common/fonts';
import Navbar from '../navbar/navbar';
import styles from './header.module.css';
import logo from '@/assets/images/logo.png';
import { PATH } from '@/common/enums';
import UserMenu from './user-menu';

function Header() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href={PATH.HOME} className={styles.logo}>
          <div className={styles.logoImage}>
            <Image src={logo} alt="logo" fill />
          </div>

          <div className={styles.logoText + ' ' + notoSerif.className}>
            <h2>Anvita</h2>
            <p>An tâm từ thiên nhiên</p>
          </div>
        </Link>

        <div className={styles.nav}>
          <Navbar />

          <Link href={PATH.CART} className={styles.cart}>
            <FaShoppingCart className={styles.cartIcon} />
          </Link>

          <UserMenu />
        </div>
      </header>
    </div>
  );
}

export default Header;
