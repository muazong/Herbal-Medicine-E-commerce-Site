'use client';

import { useEffect } from 'react';
import { PATH } from '@/common/enums';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAccessToken } from '@/common/lib/local-storage-actions';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('token');

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      router.push(PATH.HOME);
    }
  }, [accessToken, router]);

  return <p>Đang đăng nhập...</p>;
}
