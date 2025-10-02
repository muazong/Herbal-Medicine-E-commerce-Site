'use client';

import { GrGithub, GrGoogle } from 'react-icons/gr';
import styles from './auth-form.module.css';
import { env } from '@/common/config';
import { useRouter } from 'next/navigation';

function LoginChoiceButtons({ text }: { text: 'Đăng ký' | 'Đăng nhập' }) {
  const router = useRouter();

  return (
    <div className={styles.loginChoices}>
      <button
        onClick={() => router.push(`${env.API_URL}/auth/github/login`)}
        type="button"
        className={styles.loginChoice}
      >
        <GrGithub className={styles.icon} />
        <p>{text} bằng Github</p>
      </button>
      <button
        onClick={() => router.push(`${env.API_URL}/auth/google/login`)}
        type="button"
        className={styles.loginChoice}
      >
        <GrGoogle className={styles.icon} />
        <p>{text} bằng Google</p>
      </button>
    </div>
  );
}

export default LoginChoiceButtons;
