'use client';

import { useEffect, useState } from 'react';

import { PATH } from '@/common/enums';
import Button from '../button/button';
import styles from './header.module.css';
import Profile from '../profile/profile';
import { getCurrentUser } from '@/services';
import { useUserStore } from '@/stores/user-store';

function UserMenu() {
  const user = useUserStore((state) => state.getUser());
  const setUser = useUserStore((state) => state.setUser);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!user) setUser(null);
        else setUser(user);
      } finally {
        setLoading(false);
      }
    })();
  }, [setUser]);

  if (loading) {
    return <p className={styles.loading}>Đang tải...</p>;
  }

  return (
    <>
      {!user ? (
        <Button
          text="Đăng nhập"
          type="link"
          href={PATH.LOGIN}
          className={styles.register}
        />
      ) : (
        <Profile currentUser={user} />
      )}
    </>
  );
}

export default UserMenu;
