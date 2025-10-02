import { Metadata } from 'next';
import styles from '../page.module.css';
import Link from 'next/link';
import { PATH } from '@/common/enums';
import {
  LoginChoiceButtons,
  RegisterForm,
} from '@/components/auth-page/auth-form';

export const metadata: Metadata = {
  title: 'Đăng ký',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

function RegisterPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Đăng ký</h1>
      <RegisterForm />
      <p className={styles.text}>
        Đã có tài khoản? <Link href={PATH.LOGIN}>Đăng nhập ngay!</Link>
      </p>
      <LoginChoiceButtons text="Đăng ký" />
    </div>
  );
}

export default RegisterPage;
