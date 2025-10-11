'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { FaPenToSquare } from 'react-icons/fa6';
import { ChangeEvent, FormEvent, useState } from 'react';

import { env } from '@/common/config';
import styles from './page.module.css';
import { getCurrentUser } from '@/services';
import { useUserStore } from '@/stores/user-store';
import { updateUser } from '@/services/user-service';
import { ACCOUNT_STATUS, USER_ROLES } from '@/common/enums';
import { apiWithAuth } from '@/services/axios-instance-client';

export default function ProfilePage() {
  const user = useUserStore((state) => state.getUser());
  const setUser = useUserStore((state) => state.setUser);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [localCover, setLocalCover] = useState<string | null>(null);

  if (!user) {
    return (
      <div style={{ height: '100vh', marginTop: 'var(--header-height)' }}>
        <p>Không có thông tin của tài khoản.</p>
      </div>
    );
  }

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

      toast.success(
        type === 'avatar'
          ? 'Cập nhật ảnh đại diện thành công!'
          : 'Cập nhật ảnh bìa thành công!',
      );
    } catch {
      toast.error('Cập nhật hình đại diện thất bại!');
    }
  };
  const handleSaveChanges = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const status = formData.get('status') as ACCOUNT_STATUS;

    const userUpdated = await updateUser(user.id, {
      firstName,
      lastName,
      phone,
      address,
      status,
    });

    if (userUpdated) {
      setUser(userUpdated);
      toast.success('Cập nhật thành công!');
    } else {
      toast.error('Cập nhật thất bại!');
    }
  };

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
          <h1>Thông tin người dùng</h1>
          <form className={styles.form} onSubmit={handleSaveChanges}>
            <label htmlFor="firstName">
              Họ:{' '}
              <input
                id="firstName"
                name="firstName"
                defaultValue={user.firstName}
                placeholder="Họ"
              />
            </label>

            <label htmlFor="lastName">
              Tên:{' '}
              <input
                id="lastName"
                name="lastName"
                defaultValue={user.lastName}
                placeholder="Tên"
              />
            </label>

            <label htmlFor="role">
              Vai trò:{' '}
              <p>
                {user.role === USER_ROLES.ADMIN ? 'Quản trị' : 'Khách hàng'}
              </p>
            </label>

            <label htmlFor="email">
              Email: <p>{user.email}</p>
            </label>

            <label htmlFor="phone">
              Số điện thoại:{' '}
              <input
                id="phone"
                name="phone"
                defaultValue={user.phone}
                placeholder="Số diện thoại"
              />
            </label>

            <label htmlFor="address">
              Địa chỉ:{' '}
              <input
                id="address"
                name="address"
                defaultValue={user.address}
                placeholder="Địa chỉ"
              />
            </label>

            <label htmlFor="provider">
              Đăng nhập bằng: <p>{user.provider}</p>
            </label>

            <label htmlFor="status">
              Trạng thái:{' '}
              <select defaultValue={user.status && user.status} name="status">
                <option value={ACCOUNT_STATUS.ACTIVE}>Hoạt động</option>
                <option value={ACCOUNT_STATUS.INACTIVE}>Ngừng hoạt động</option>
                <option value={ACCOUNT_STATUS.BLOCKED}>Khoá tài khoản</option>
              </select>
            </label>

            <button type="submit" className={styles.button}>
              Lưu thay đổi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
