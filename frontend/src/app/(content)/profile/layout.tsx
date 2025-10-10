import { UserGuard } from '@/common/guards';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserGuard>{children}</UserGuard>;
}
