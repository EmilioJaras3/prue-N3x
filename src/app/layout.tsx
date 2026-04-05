import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import VideoBackground from '@/components/ui/VideoBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Panel Seguro | Auth Vault Pro',
  description: 'Gestión de identidad ultra segura con tecnología de bóveda digital.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-neutral-950 font-inter antialiased text-white selection:bg-cyan-500/30">
        <VideoBackground />
        <main className="relative z-10 min-h-screen flex flex-col justify-center items-center p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
