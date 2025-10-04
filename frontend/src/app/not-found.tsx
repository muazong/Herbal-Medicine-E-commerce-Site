'use client';
import Image from 'next/image';
import './globals.css';

import styles from './not-found.module.css';
import notFound from '@/assets/images/not-found.png';
import Link from 'next/link';
import { PATH } from '@/common/enums';

function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image src={notFound} alt="404" fill />
      </div>
      <h1 className={styles.title}>Không tìm thấy trang này!</h1>
      <Link className={styles.link} href={PATH.HOME}>
        Quay về trang chủ
      </Link>
    </div>
  );
}

export default NotFound;
