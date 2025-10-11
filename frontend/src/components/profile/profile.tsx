'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { api } from '@/services';
import { PATH } from '@/common/enums';
import { env } from '@/common/config';
import styles from './profile.module.css';
import { User } from '@/common/interfaces';
import { removeAccessToken } from '@/common/lib/local-storage-actions';

function Profile({ currentUser }: { currentUser: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await api.post(
        '/auth/logout',
        {},
        {
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        removeAccessToken();
        window.location.href = PATH.LOGIN;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container} onClick={() => setIsOpen(!isOpen)}>
      <div className={styles.avatar}>
        {currentUser.avatar ? (
          <Image
            src={
              currentUser.avatar.path.startsWith('https')
                ? currentUser.avatar.path
                : `${env.SERVER_URL}${currentUser.avatar.path}?v=${Date.now()}`
            }
            alt="logo"
            fill
            className={styles.img}
          />
        ) : (
          <Image src={env.AVATAR_URL} alt="logo" fill className={styles.img} />
        )}
      </div>

      <div
        className={styles.dropdown}
        style={{ display: isOpen ? 'block' : 'none' }}
        ref={ref}
      >
        <ul className={styles.dropdownList}>
          <li>
            <Link href={PATH.PROFILE}>Tài khoản</Link>
          </li>
          <li>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
            >
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
