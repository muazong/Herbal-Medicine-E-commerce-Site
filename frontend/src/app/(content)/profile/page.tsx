'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { FaPenToSquare } from 'react-icons/fa6';

import { CurrentUser } from '@/common/interfaces';
import { getCurrentUser } from '@/services';
import Image from 'next/image';
import styles from './page.module.css';
import { env } from '@/common/config';
import { apiWithAuth } from '@/services/axios-instance-client';

function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cover, setCover] = useState<string>('');

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return <div className={styles.container}>Đang tải...</div>;
  if (!user)
    return (
      <div className={styles.container}>
        Không tìm thấy thông tin người dùng
      </div>
    );

  const handleChangeImage = async (
    e: ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover',
  ) => {
    const formData = new FormData();
    const image = e.target.files?.[0];

    if (image) {
      formData.append('file', image);

      try {
        const res = await apiWithAuth.post(
          `/users/${user.id}/${type}`,
          formData,
        );
      } finally {
        setCover(URL.createObjectURL(image));
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Cover */}
      <div className={styles.cover}>
        <div className={styles.coverImageWrapper}>
          {user.cover ? (
            <Image
              src={
                cover
                  ? cover
                  : `${env.SERVER_URL}${user.cover.path}?v=${Date.now()}`
              }
              alt="cover"
              fill
              className={styles.coverImage}
            />
          ) : (
            <Image
              src={env.COVER_URL}
              className={styles.coverImage}
              alt="avatar"
              fill
            />
          )}

          <div className={styles.button}>
            <label htmlFor="cover" className={styles.label}>
              <FaPenToSquare className={styles.icon} />
            </label>
            <input
              type="file"
              id="cover"
              name="cover"
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
          {user.avatar ? (
            <Image
              src={
                user.avatar.path.startsWith('https')
                  ? user.avatar.path
                  : `${env.SERVER_URL}${user.avatar.path}`
              }
              alt="avatar"
              fill
              className={styles.avatarImage}
            />
          ) : (
            <Image
              src={env.AVATAR_URL}
              className={styles.avatarImage}
              alt="avatar"
              fill
            />
          )}
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

export default ProfilePage;
