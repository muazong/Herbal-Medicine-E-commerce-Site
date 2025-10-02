'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import styles from './profile.module.css';
import { CurrentUser } from '@/common/interfaces';
import { api, env } from '@/common/config';
import { removeAccessToken } from '@/common/lib/local-storage-actions';

function Profile({ currentUser }: { currentUser: CurrentUser }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    removeAccessToken();
    try {
      await api.post(
        '/auth/logout',
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className={styles.container} onClick={() => setIsOpen(!isOpen)}>
      <div className={styles.avatar}>
        <Image
          src={currentUser.avatar ? currentUser.avatar.path : env.AVATAR_URL}
          alt="logo"
          fill
          className={styles.img}
        />
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
            <Link href={''} onClick={handleLogout}>
              Đăng xuất
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
