'use client';

import { usePokemonStore, REGIONS, RegionKey } from '@/restructurado/frontend/store/pokemonStore';
import { ChevronDownIcon, GlobeIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function RegionSelector() {
  const { selectedRegion, setRegion } = usePokemonStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/50 hover:bg-neutral-800/80 border border-white/5 hover:border-white/10 rounded-lg transition-all duration-300 group"
      >
        <GlobeIcon size={14} className="text-neutral-500 group-hover:text-neutral-300 transition-colors" />
        <span className="text-[10px] text-neutral-300 font-inter font-medium uppercase tracking-wider">
          Red {REGIONS[selectedRegion].name}
        </span>
        <ChevronDownIcon size={12} className={`text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#0D0D0D] border border-white/10 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1">
            {(Object.keys(REGIONS) as RegionKey[]).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setRegion(key);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-inter transition-colors flex items-center justify-between ${
                  selectedRegion === key 
                    ? 'bg-neutral-800 text-white' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                }`}
              >
                <span>{REGIONS[key].name}</span>
                <span className="text-[9px] text-neutral-600 font-medium">Gen {Object.keys(REGIONS).indexOf(key) + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
