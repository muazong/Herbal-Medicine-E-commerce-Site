import Image from 'next/image';
import Link from 'next/link';

import styles from './footer.module.css';
import logo from '@/assets/images/logo.png';
import { notoSerif } from '@/common/fonts';
import { PATH } from '@/common/enums';

function Footer() {
  return (
    <footer className={styles.container}>
      <hr />
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
          <h1>Công ty</h1>
        </div>
        <div className={styles.links}>
          <h1>Sản phẩm</h1>
        </div>
        <div className={styles.links}>
          <h1>Kết nối</h1>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
