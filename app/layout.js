import { Suspense } from 'react';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import RouteProgressBar from './components/RouteProgressBar';
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
  title: 'Syed Raza Jan | Architect & Spatial Designer',
  description: 'Principal Architect with 9+ years of experience in architectural design, interior architecture, 3D visualization, and site execution. CEO at The Mine Architects.',
  keywords: 'architect, interior designer, 3D visualization, Islamabad, Pakistan, Syed Raza Jan, The Mine Architects',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body>
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
