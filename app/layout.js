import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata = {
  title: 'SRJ Studio — Syed Raza Jan | Architect & Interior Designer',
  description: 'Architect with 9+ years of experience in architectural design, interior design, 3D visualization, and site execution. Based in Islamabad, Pakistan.',
  keywords: 'architect, interior designer, 3D visualization, Islamabad, Pakistan, SRJ Studio, Syed Raza Jan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
