'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { PATH, USER_ROLES } from '@/common/enums';
import { getCurrentUser } from '@/services';

function AdminGuard({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.role === USER_ROLES.CLIENT)
        router.replace(PATH.HOME);
      else setIsLoading(false);
    })();
  }, [router]);

  if (isLoading) return <div>Đang tải...</div>;
  return <>{children}</>;
}

export default AdminGuard;
