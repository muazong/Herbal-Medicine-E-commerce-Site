'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import styles from './profile.module.css';
import logo from '@/assets/images/logo.png';

function Profile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container} onClick={() => setIsOpen(!isOpen)}>
      <div className={styles.avatar}>
        <Image src={logo} alt="logo" fill className={styles.img} />
      </div>

      <div
        className={styles.dropdown}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        <ul className={styles.dropdownList}>
          <li>
            <Link href={''}>Tài khoản</Link>
          </li>
          <li>
            <Link href={''}>Đăng xuất</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
