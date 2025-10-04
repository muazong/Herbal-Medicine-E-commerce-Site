import Image from 'next/image';

import { notoSerif, roboto } from '@/common/fonts';
import styles from './layout.module.css';
import '../globals.css';
import logo from '@/assets/images/logo_no_text.png';
import Link from 'next/link';
import { PATH } from '@/common/enums';
import { AuthGuard } from '@/common/guards';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className={roboto.className}>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <Image src={logo} alt="Logo" width={100} height={100} />
            </div>
            <div className={styles.text + ' ' + notoSerif.className}>
              <h1 className={styles.title}>Anvita</h1>
              <p className={styles.subtitle}>An tâm từ thiên nhiên</p>

              <p className={styles.description}>
                Anvita là nền tảng chuyên cung cấp các sản phẩm đông dược thiên
                nhiên an toàn, hiệu quả và uy tín – được nghiên cứu và bào chế
                từ những dược liệu quý của Việt Nam. Chúng tôi tin rằng sức khỏe
                bền vững bắt đầu từ thiên nhiên, vì thế Anvita không chỉ mang
                đến sản phẩm chất lượng mà còn đồng hành cùng bạn trong hành
                trình chăm sóc và nâng cao sức khỏe mỗi ngày. Hãy đăng nhập để
                trải nghiệm thế giới thảo dược chuẩn y học cổ truyền ngay hôm
                nay
              </p>
            </div>
          </div>
          <div className={styles.content}>{children}</div>
          <Link href={PATH.HOME} className={styles.link}>
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </AuthGuard>
  );
}
