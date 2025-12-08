'use client';

import { Suspense } from 'react';
import Content from './content';

function ProductContent() {
  return (
    <Suspense fallback={<p>Đang tải...</p>}>
      <Content />
    </Suspense>
  );
}

export default ProductContent;
