'use client';

import { useState } from 'react';
import { roboto } from '@/common/fonts';
import styles from './auth-form.module.css';
import { api } from '@/common/config';
import { setAccessToken } from '@/common/lib/local-storage-actions';

export default function LoginForm() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.email === '' || formState.password === '') {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const res = await api.post('/auth/login', formState, {
        withCredentials: true,
      });

      if (!res.data.accessToken) {
        throw new Error('Không thể kết nối tới hệ thống!');
      }

      setAccessToken(res.data.accessToken);
    } catch (error) {
      const err = error as Error;
      setError('Email hoặc mật khẩu không đúng!');
      throw new Error(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form + ' ' + roboto.className}
    >
      <input
        className={styles.input}
        type="email"
        name="email"
        value={formState.email}
        placeholder="Email"
        onChange={handleInput}
      />
      <input
        className={styles.input}
        type="password"
        name="password"
        value={formState.password}
        placeholder="Mật khẩu"
        onChange={handleInput}
      />

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit">Đăng nhập</button>
    </form>
  );
}
