'use client';

import { ActivityIcon, FingerprintIcon } from 'lucide-react';

export default function PokedexSkeleton() {
  return (
    <article className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-white/10 to-transparent" />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-manrope font-semibold flex items-center gap-2 text-white/20 tracking-wide">
          <FingerprintIcon className="text-white/10" size={16} />
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
        </h3>
        <div className="h-7 w-20 bg-white/5 rounded-md animate-pulse flex items-center gap-2 px-3">
          <ActivityIcon size={14} className="text-white/10" />
        </div>
      </div>

      <div className="min-h-[220px]">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Imagen Skeleton */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 mx-auto md:mx-0 bg-white/5 rounded-[2rem] border border-white/5 animate-pulse" />
          
          {/* Datos Skeleton */}
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
            </div>

            <div className="flex gap-4 mt-4">
              <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
              <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
            </div>

            {/* Stats Skeleton */}
            <div className="pt-2 space-y-3">
              <div className="h-2 w-24 bg-white/5 rounded animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-2 bg-white/5 rounded animate-pulse" />
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full animate-pulse" />
                  <div className="w-6 h-2 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
