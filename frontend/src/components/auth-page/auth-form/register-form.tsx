'use client';

import React, { useState } from 'react';
import styles from './auth-form.module.css';
import { roboto } from '@/common/fonts';

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form + ' ' + roboto.className}
    >
      <input
        name="name"
        value={formState.name}
        className={styles.input}
        type="text"
        placeholder="Họ và tên"
        onChange={handleInput}
      />
      <input
        name="email"
        value={formState.email}
        className={styles.input}
        type="email"
        placeholder="Email"
        onChange={handleInput}
      />
      <input
        name="phone"
        value={formState.phone}
        className={styles.input}
        type="text"
        placeholder="Số điện thoại"
        onChange={handleInput}
      />
      <input
        name="address"
        value={formState.address}
        className={styles.input}
        type="text"
        placeholder="Địa chỉ"
        onChange={handleInput}
      />
      <input
        name="password"
        value={formState.password}
        className={styles.input}
        type="password"
        placeholder="Mật khẩu"
        onChange={handleInput}
      />
      <input
        name="confirmPassword"
        value={formState.confirmPassword}
        className={styles.input}
        type="password"
        placeholder="Nhập lại mật khẩu"
        onChange={handleInput}
      />

      <button type="submit">Đăng ký</button>
    </form>
  );
}
