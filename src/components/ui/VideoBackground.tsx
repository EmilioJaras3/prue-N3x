'use client';

import { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Si estamos en el dashboard, pausamos el video para ahorrar recursos
    if (pathname?.startsWith('/dashboard')) {
      video.pause();
    } else {
      // En cualquier pantalla de Auth o el Landing, reproducimos en bucle
      video.play().catch((err) => console.log('El auto-play falló:', err));
    }
  }, [pathname]);

  // En el dashboard ya tenemos un fondo oscuro nativo, así que inclusive podemos 
  // ocular el display del video.
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden bg-neutral-950 transition-opacity duration-1000 ${isDashboard ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.06),transparent_70%)]" />
      
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-70"
        src="/bg-glass.mp4"
      />

      <div className="absolute inset-0 bg-neutral-950/50" />
    </div>
  );
}
