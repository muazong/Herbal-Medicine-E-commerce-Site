'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ProgressBar options={{ showSpinner: false }} shallowRouting />
      </body>
    </html>
  );
}
