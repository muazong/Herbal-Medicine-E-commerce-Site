'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsEyeSlashFill } from 'react-icons/bs';
import { IoEyeSharp } from 'react-icons/io5';
import { every, isEmpty } from 'lodash';

import styles from './auth-form.module.css';
import { roboto } from '@/common/fonts';
import { api } from '@/services';
import { AxiosError } from 'axios';
import { PATH } from '@/common/enums';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [formState, setFormState] = useState<FormState>({
    firstName: 'user',
    lastName: '1',
    email: 'user@gmail.com',
    phone: '0387654321',
    address: 'Vietnam',
    password: 'user1234',
    confirmPassword: 'user1234',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    let isFormFailed = false;
    const isFormFilled = every(formState, (value) => !isEmpty(value.trim()));

    if (!isFormFilled) {
      setErrors((prev) => [...prev, 'Vui lòng nhập đầy đủ thông tin!']);
      return;
    }

    if (formState.firstName.length < 2 || formState.firstName.length > 50) {
      isFormFailed = true;
      setErrors((prev) => [...prev, 'Họ chỉ được dài từ 2 đến 50 ký tự']);
    }

    if (formState.lastName.length < 1 || formState.firstName.length > 50) {
      isFormFailed = true;
      setErrors((prev) => [...prev, 'Tên chỉ được dài từ 1 đến 50 ký tự']);
    }

    if (formState.phone.length !== 10) {
      isFormFailed = true;
      setErrors((prev) => [...prev, 'Số điện thoại phải là 10 ký tự']);
    }

    if (formState.password.length < 8) {
      setErrors((prev) => [...prev, 'Mật khẩu phải là 8 ký tự trở lên']);
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      isFormFailed = true;
      setErrors((prev) => [...prev, 'Mật khẩu không khớp']);
    }

    if (isFormFailed) {
      return;
    }

    const { confirmPassword: _, ...formData } = formState;

    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', formData);

      if (response.status === 201) {
        router.push(PATH.LOGIN);
      }
    } catch (error) {
      setIsLoading(false);
      const err = error as AxiosError;
      if (err.response) {
        if (err.response.status === 409) {
          setErrors((prev) => [...prev, 'Email đã được sử dụng']);
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
        name="firstName"
        value={formState.firstName}
        className={styles.input}
        type="text"
        placeholder="Họ"
        onChange={handleInput}
      />
      <input
        name="lastName"
        value={formState.lastName}
        className={styles.input}
        type="text"
        placeholder="Tên"
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
      <div className={styles.passwordWrapper}>
        <input
          name="confirmPassword"
          value={formState.confirmPassword}
          className={styles.password}
          type={isShowConfirmPassword ? 'text' : 'password'}
          placeholder="Nhập lại mật khẩu"
          onChange={handleInput}
        />

        <span
          className={styles.eye}
          onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
        >
          {isShowConfirmPassword ? <IoEyeSharp /> : <BsEyeSlashFill />}
        </span>
      </div>

      <div>
        {errors &&
          errors.map((err) => (
            <p className={styles.error} key={err}>
              {err}
            </p>
          ))}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Vui lòng đợi...' : 'Đăng ký'}
      </button>
    </form>
  );
}
