'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { PATH } from '@/common/enums';
import { getCurrentUser } from '@/services';

function UserGuard({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) router.replace(PATH.LOGIN);
      else setIsLoading(false);
    })();
  }, [router]);

  if (isLoading)
    return (
      <div style={{ height: '100vh', marginTop: 'var(--header-height)' }}></div>
    );
  return <>{children}</>;
}

export default UserGuard;
