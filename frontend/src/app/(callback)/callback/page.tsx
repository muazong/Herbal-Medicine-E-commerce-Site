'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PATH } from '@/common/enums';
import { setAccessToken } from '@/common/lib/local-storage-actions';

export default function AuthCallbackPage() {
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
