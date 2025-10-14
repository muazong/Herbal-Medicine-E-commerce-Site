import { ReactNode } from 'react';
import { UserGuard } from '@/common/guards';

export default function OrderTemplate({ children }: { children: ReactNode }) {
  return <UserGuard>{children}</UserGuard>;
}
