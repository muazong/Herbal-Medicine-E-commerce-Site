import { Metadata } from 'next';

import '../globals.css';
import { Footer, Header } from '@/components';
import { roboto } from '@/common/fonts';

export const metadata: Metadata = {
  title: 'Anvita - An tâm từ thiên nhiên',
  description:
    'Chào mừng bạn đến với Anvita – nơi mang đến các sản phẩm Đông dược thiên nhiên, an toàn và hiệu quả. Cùng Anvita chăm sóc sức khỏe toàn diện cho bạn và gia đình."',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={roboto.className}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
