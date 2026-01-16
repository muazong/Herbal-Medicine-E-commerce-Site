'use client';

import { toast } from 'sonner';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

import styles from './dashboard-users.module.css';
import formatDayVi from '@/common/lib/format-day-vi';
import { useUsersStore } from '@/stores/users-store';
import { deleteUser, getUsers } from '@/services/user-service';
import { account_status_vi, user_role_vi } from '@/common/config';

function DashboardUsers() {
  const users = useUsersStore((state) => state.users);
  const setUsers = useUsersStore((state) => state.setUsers);
  // const getUsersStore = useUsersStore((state) => state.getUsers);

  useEffect(() => {
    (async () => {
      const res = await getUsers();
      if (res) {
        setUsers(res);
      }
    })();
  }, [setUsers]);

  const handleDeleteUser = async (userId: string) => {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá người dùng này không?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Huỷ',
      background: 'rgba(60, 70, 123)',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteUser(userId);
        if (res) {
          setUsers(users.filter((user) => user.id !== userId));
          toast.success('Người dùng đã được xóa thành công!');
        } else {
          toast.error('Xóa người dùng thất bại!');
        }
      }
    });
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
                <td>{index + 1}</td>
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
                    Sửa
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
