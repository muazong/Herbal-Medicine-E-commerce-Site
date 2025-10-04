import { ProfileGuard } from '@/common/guards';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileGuard>{children}</ProfileGuard>;
}
