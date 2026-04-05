'use client';

import { useRef } from 'react';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-neutral-950">
      {/* Gradiente de respaldo (Mewtwo Style - Morado/Azul Oscuro) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.08),transparent_70%)]" />
      
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-80"
      >
        <source src="/bg-mewtwo.mp4" type="video/mp4" />
      </video>

      {/* Overlay suave para integrar el video dark theme */}
      <div className="absolute inset-0 bg-neutral-950/60" />
    </div>
  );
}
