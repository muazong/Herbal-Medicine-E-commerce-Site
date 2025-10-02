'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import { roboto } from '@/common/fonts';
import { useRouter } from 'next/navigation';
import styles from './auth-form.module.css';
import { IoEyeSharp } from 'react-icons/io5';
import { BsEyeSlashFill } from 'react-icons/bs';

import { api } from '@/common/config';
import { setAccessToken } from '@/common/lib/local-storage-actions';
import { PATH } from '@/common/enums';

export default function LoginForm() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const router = useRouter();

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
      setIsLoading(true);
      const res = await api.post('/auth/login', formState, {
        withCredentials: true,
      });

      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken);
      }

      router.push(PATH.HOME);
    } catch (error) {
      setIsLoading(false);
      const err = error as AxiosError;
      if (err.response) {
        if (err.response.status === 401) {
          setError('Email hoặc mật khẩu không chính xác');
        }
      }
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
      <div className={styles.passwordWrapper}>
        <input
          name="password"
          value={formState.password}
          className={styles.password}
          type={isShowPassword ? 'text' : 'password'}
          placeholder="Mật khẩu"
          onChange={handleInput}
        />
        <span
          className={styles.eye}
          onClick={() => setIsShowPassword(!isShowPassword)}
        >
          {isShowPassword ? <IoEyeSharp /> : <BsEyeSlashFill />}
        </span>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Vui lòng đợi...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
