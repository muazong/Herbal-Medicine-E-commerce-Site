'use client';

import { useEffect, useState } from 'react';
import styles from './dashboard-users.module.css';

import { User } from '@/common/interfaces';
import { getUsers } from '@/services/user-service';
import formatDayVi from '@/common/lib/format-day-vi';

function DashboardUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getUsers();

      if (res) {
        setUsers(res);
      }
    })();
  }, [users]);

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
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.provider}</td>
                <td>{user.status}</td>
                <td>{formatDayVi(user.createdAt)}</td>
                <td>{formatDayVi(user.updatedAt)}</td>
                <td className={styles.actions}>
                  <button className={`${styles.btn} ${styles.edit}`}>
                    Sửa
                  </button>
                  <button className={`${styles.btn} ${styles.delete}`}>
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
