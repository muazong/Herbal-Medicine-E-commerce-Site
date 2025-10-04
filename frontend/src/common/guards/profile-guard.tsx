'use client';

import { PATH } from '@/common/enums';
import { getCurrentUser } from '@/services';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace(PATH.LOGIN);
      } else {
        setIsLoading(false);
      }
    })();
  }, [router]);

  if (isLoading) return <p style={{ height: '100vh' }}>Đang tải...</p>;

  return <>{children}</>;
}

export default AuthGuard;
