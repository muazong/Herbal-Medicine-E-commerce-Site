import Link from 'next/link';
import Image from 'next/image';

import { notoSerif } from '@/common/fonts';
import Navbar from '../navbar/navbar';
import styles from './header.module.css';
import logo from '@/assets/images/logo.png';
import { PATH } from '@/common/enums';
import UserMenu from './user-menu';
import CartLink from './cart-link';

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
          <CartLink />
          <UserMenu />
        </div>
      </header>
    </div>
  );
}

export default Header;
