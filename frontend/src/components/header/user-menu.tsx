'use client';

import { useEffect, useState } from 'react';

import { PATH } from '@/common/enums';
import Button from '../button/button';
import styles from './header.module.css';
import Profile from '../profile/profile';
import { getCurrentUser } from '@/services';
import { CurrentUser } from '@/common/interfaces';

function UserMenu() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setCurrentUser(null);
        } else {
          setCurrentUser(user);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Đang tải...</p>;
  }

  return (
    <>
      {!currentUser ? (
        <Button
          text="Đăng nhập"
          type="link"
          href={PATH.LOGIN}
          className={styles.register}
        />
      ) : (
        <Profile currentUser={currentUser} />
      )}
    </>
  );
}

export default UserMenu;
