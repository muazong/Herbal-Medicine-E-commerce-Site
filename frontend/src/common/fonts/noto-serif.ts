import { Noto_Serif } from 'next/font/google';

export const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-serif',
});
