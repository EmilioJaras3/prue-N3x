'use client';

import { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (videoRef.current) {
      // Diferente momento del video según la ruta
      if (pathname === '/login') {
        videoRef.current.currentTime = 5; // Salta al segundo 5 para login
      } else if (pathname === '/register') {
        videoRef.current.currentTime = 0; // Inicia desde 0 para registro
      }
    }
  }, [pathname]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-neutral-950">
      {/* Gradiente de respaldo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_70%)]" />
      
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-80"
      >
        <source src="/bg-vault.mp4" type="video/mp4" />
      </video>

      {/* Overlay suave para que el texto sea legible */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
