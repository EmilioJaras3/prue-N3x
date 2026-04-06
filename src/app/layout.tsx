import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import VideoBackground from '@/restructurado/frontend/components/ui/VideoBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Caja Pokémon | Panel Seguro',
  description: 'Sistema de autenticación y almacenamiento de Pokémon con protección avanzada.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="bg-white font-inter antialiased text-gray-900 selection:bg-blue-200" suppressHydrationWarning>
        <VideoBackground />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
