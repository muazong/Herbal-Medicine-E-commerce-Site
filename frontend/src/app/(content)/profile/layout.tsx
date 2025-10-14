import { Metadata } from 'next';

import { UserGuard } from '@/common/guards';

export const metadata: Metadata = {
  title: 'Thông tin cá nhân',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserGuard>{children}</UserGuard>;
}
