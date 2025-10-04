import Image from 'next/image';
import Link from 'next/link';

import styles from './footer.module.css';
import logo from '@/assets/images/logo.png';
import { notoSerif } from '@/common/fonts';
import { PATH } from '@/common/enums';

function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo + ' ' + notoSerif.className}>
          <Link href={PATH.HOME}>
            <div className={styles.logoImage}>
              <Image src={logo} alt="logo" fill />
            </div>
          </Link>
          <h1 className={styles.title}>Anvita</h1>
          <p className={styles.description}>An tâm từ thiên nhiên</p>
        </div>

        <div className={styles.links}>
          <h2>Công ty</h2>
          <Link href={PATH.ABOUT}>Về chúng tôi</Link>
          <Link href={PATH.CONTACT}>Liên hệ</Link>
          <Link href={''}>Chính sách</Link>
        </div>

        <div className={styles.links}>
          <h2>Sản phẩm</h2>
          <Link href={PATH.PRODUCTS}>Danh mục</Link>
          <Link href={''}>Khuyến mãi</Link>
          <Link href={''}>Blog sức khỏe</Link>
        </div>

        <div className={styles.links}>
          <h2>Kết nối</h2>
          <a href="https://facebook.com" target="_blank">
            Facebook
          </a>
          <a href="https://zalo.me" target="_blank">
            Zalo
          </a>
          <a href="mailto:contact@anvita.vn">Email</a>
          <p className={styles.hotline}>Hotline: 0123 456 789</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Anvita. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
