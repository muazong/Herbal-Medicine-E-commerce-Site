'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

import { PATH } from '@/common/enums';
import { getCurrentUser } from '@/services';
import { useUserStore } from '@/stores/user-store';

function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useUserStore((state) => state.getUser());
  const setUser = useUserStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (user) {
        router.replace(PATH.HOME);
      } else {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          router.replace(PATH.HOME);
        } else setIsLoading(false);
      }
    })();
  }, [router, setUser, user]);

  if (isLoading) return null;
  return <>{children}</>;
}

export default AuthGuard;
