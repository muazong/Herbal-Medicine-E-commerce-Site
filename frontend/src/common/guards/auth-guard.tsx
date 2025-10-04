'use client';

import { PATH } from '@/common/enums';
import { getCurrentUser } from '@/services';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

function AuthGuard({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setIsLoading(true);
        router.replace(PATH.HOME);
      } else {
        setIsLoading(false);
      }
    })();
  }, [router]);

  if (isLoading) return <p>Đang tải...</p>;

  return <>{children}</>;
}

export default AuthGuard;
