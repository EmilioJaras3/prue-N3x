'use client';

import { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let segmentStart = 0;
    let segmentEnd = 10;
    let isStatic = false;

    // Se calcula cuando se cargan los metadatos o cada vez que cambia la ruta
    const updateSegments = () => {
      const dur = video.duration || 10;
      
      // Dividimos en las partes que solicitaste (Inicio -> Registro -> Login)
      if (pathname === '/') {
        segmentStart = 0;
        segmentEnd = dur * 0.33;
        isStatic = false;
      } else if (pathname === '/register') {
        segmentStart = dur * 0.33;
        segmentEnd = dur * 0.66;
        isStatic = false;
      } else if (pathname === '/login') {
        segmentStart = dur * 0.66;
        segmentEnd = dur * 0.95;
        isStatic = false;
      } else if (pathname === '/dashboard') {
        segmentStart = dur; // Fin del video
        segmentEnd = dur;
        isStatic = true;
      }

      video.loop = false; // Manejamos el loop manualmente

      if (isStatic) {
        video.currentTime = dur;
        video.pause();
      } else {
        // Solo brinca si está totalmente fuera del segmento
        if (video.currentTime < segmentStart || video.currentTime > segmentEnd) {
          video.currentTime = segmentStart;
        }
        video.play().catch(() => {});
      }
    };

    if (video.readyState >= 1) {
      updateSegments();
    } else {
      video.addEventListener('loadedmetadata', updateSegments);
    }

    const handleTimeUpdate = () => {
      if (isStatic) {
        video.pause();
        return;
      }
      
      // Si llega al final de su segmento, regresa al inicio de ESE segmento.
      // Así se ve "que se mueva todo el ciclo" dentro de su parte de la historia.
      if (video.currentTime >= segmentEnd) {
        video.currentTime = segmentStart;
        video.play().catch(() => {});
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('loadedmetadata', updateSegments);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [pathname]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.06),transparent_70%)]" />
      
      <video
        ref={videoRef}
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-70 transition-opacity duration-1000"
        src="/bg-glass.mp4"
      />

      <div className="absolute inset-0 bg-neutral-950/50" />
    </div>
  );
}
