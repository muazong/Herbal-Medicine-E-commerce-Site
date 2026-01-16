'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { PATH } from '@/common/enums';
import { swal_fire } from '@/common/lib/swal';
import styles from './dashboard-users.module.css';
import formatDayVi from '@/common/lib/format-day-vi';
import { useUsersStore } from '@/stores/users-store';
import { deleteUser, getUsers } from '@/services/user-service';
import { account_status_vi, user_role_vi } from '@/common/config';
import { usePaginationStore } from '@/stores/pagination-store';

function DashboardUsers() {
  const users = useUsersStore((state) => state.users);
  const setUsers = useUsersStore((state) => state.setUsers);
  const currentPage = usePaginationStore((state) => state.currentPage);
  // const getUsersStore = useUsersStore((state) => state.getUsers);

  useEffect(() => {
    (async () => {
      const res = await getUsers(currentPage);
      if (res) {
        setUsers(res);
      }
    })();
  }, [setUsers, currentPage]);

  const handleDeleteUser = async (userId: string) => {
    swal_fire('Bạn có chắc chắn xoá người dùng này không?').then(
      async (result) => {
        if (result.isConfirmed) {
          const res = await deleteUser(userId);
          if (res) {
            setUsers(users.filter((user) => user.id !== userId));
            toast.success('Người dùng đã được xóa thành công!');
          } else {
            toast.error('Xóa người dùng thất bại!');
          }
        }
      },
    );
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên người dùng</th>
            <th>Vai trò</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Nhà cung cấp</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.empty}>
                Không có người dùng nào
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>
                  {currentPage === 1
                    ? index + 1
                    : index + 1 + 9 * (currentPage - 1)}
                </td>
                <td>{user.fullName}</td>
                <td>{user_role_vi[user.role]}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.provider}</td>
                <td>{account_status_vi[user.status]}</td>
                <td>{formatDayVi(user.createdAt)}</td>
                <td>{formatDayVi(user.updatedAt)}</td>
                <td className={styles.actions}>
                  <button className={`${styles.btn} ${styles.edit}`}>
                    <Link href={`${PATH.USERS_MANAGEMENT}/${user.id}`}>
                      Sửa
                    </Link>
                  </button>
                  <button
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardUsers;
