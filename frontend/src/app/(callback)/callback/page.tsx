'use client';

import { Suspense } from 'react';
import { AuthCallbackContent } from '@/components/auth-page';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>Đang tải...</p>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
