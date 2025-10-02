import Link from 'next/link';
import { Metadata } from 'next';
import styles from '../page.module.css';
import { PATH } from '@/common/enums';
import { LoginForm } from '@/components/auth-page/auth-form';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

function LoginPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Đăng nhập</h1>
      <LoginForm />
      <p className={styles.text}>
        Chưa có tài khoản? <Link href={PATH.REGISTER}>Đăng ký ngay!</Link>
      </p>
    </div>
  );
}

export default LoginPage;
