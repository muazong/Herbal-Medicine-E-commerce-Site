'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';

function ToasterWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            fontSize: '1rem',
          },
        }}
      />
    </>
  );
}

export default ToasterWrapper;
