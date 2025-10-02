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
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();

        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <>
      {currentUser ? (
        <Profile currentUser={currentUser} />
      ) : (
        <Button
          text="Đăng nhập"
          type="link"
          href={PATH.LOGIN}
          className={styles.register}
        />
      )}
    </>
  );
}

export default UserMenu;
