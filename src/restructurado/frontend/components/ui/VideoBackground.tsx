'use client';

import { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (pathname?.startsWith('/dashboard')) {
      video.pause();
    } else {
      video.play().catch((err) => console.log('El auto-play falló:', err));
    }
  }, [pathname]);

  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden bg-white transition-opacity duration-1000 ${isDashboard ? 'opacity-0' : 'opacity-100'}`}>
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full animate-float opacity-30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-400/20 blur-[120px] rounded-full animate-float opacity-30 delay-1000" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-yellow-400/20 blur-[100px] rounded-full opacity-20" />

      <video
        ref={videoRef}
        muted
        playsInline
        loop
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-80"
        src="/bg-pikachu.mp4"
      />

      {/* Light Overlay for readability */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
    </div>
  );
}
