'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { FaPenToSquare } from 'react-icons/fa6';
import Image from 'next/image';

import styles from './page.module.css';
import { User } from '@/common/interfaces';
import { getCurrentUser } from '@/services';
import { env } from '@/common/config';
import { apiWithAuth } from '@/services/axios-instance-client';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [localCover, setLocalCover] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading user:', err);
      }
    })();
  }, []);

  const handleChangeImage = async (
    e: ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover',
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append('file', file);

    const localURL = URL.createObjectURL(file);
    if (type === 'avatar') setLocalAvatar(localURL);
    else setLocalCover(localURL);

    try {
      await apiWithAuth.post(`/users/${user.id}/${type}`, formData);
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
    } catch (err) {
      console.error(`Update ${type} failed:`, err);
    }
  };

  if (!user)
    return (
      <div style={{ height: '100vh', marginTop: 'var(--header-height)' }}>
        <p>Không có thông tin của tài khoản.</p>
      </div>
    );

  const avatarSrc =
    localAvatar ||
    (user.avatar?.path
      ? user.avatar.path.startsWith('https')
        ? user.avatar.path
        : `${env.SERVER_URL}${user.avatar.path}?v=${user.updatedAt || Date.now()}`
      : env.AVATAR_URL);

  const coverSrc =
    localCover ||
    (user.cover?.path
      ? `${env.SERVER_URL}${user.cover.path}?v=${user.updatedAt || Date.now()}`
      : env.COVER_URL);

  return (
    <div className={styles.container}>
      {/* Cover */}
      <div className={styles.cover}>
        <div className={styles.coverImageWrapper}>
          <Image
            key={coverSrc}
            src={coverSrc}
            alt="cover"
            fill
            className={styles.coverImage}
            priority
          />
          <div className={styles.button}>
            <label htmlFor="cover" className={styles.label}>
              <FaPenToSquare className={styles.icon} />
            </label>
            <input
              type="file"
              id="cover"
              accept="image/*"
              hidden
              onChange={(e) => handleChangeImage(e, 'cover')}
            />
          </div>
        </div>
      </div>

      {/* Avatar + Info */}
      <div className={styles.profile}>
        <div className={styles.avatar}>
          <div className={styles.avatarWrapper}>
            <Image
              key={avatarSrc}
              src={avatarSrc}
              alt="avatar"
              fill
              className={styles.avatarImage}
              sizes="150px"
              priority
            />
            <div className={styles.button}>
              <label htmlFor="avatar" className={styles.label}>
                <FaPenToSquare className={styles.icon} />
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                hidden
                onChange={(e) => handleChangeImage(e, 'avatar')}
              />
            </div>
          </div>
        </div>

        <div className={styles.info}>
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <p className={styles.role}>
            {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
          </p>
          <p>Email: {user.email}</p>
          {user.phone && <p>Số điện thoại: {user.phone}</p>}
          {user.address && <p>Địa chỉ: {user.address}</p>}
          <p>Đăng nhập bằng: {user.provider}</p>
          <p>Trạng thái: {user.status}</p>
        </div>
      </div>
    </div>
  );
}
