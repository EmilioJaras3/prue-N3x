'use client';

import { useState, useEffect } from 'react';
import { getBoxPokemon } from '@/app/api/actions/pokemon.actions';
import { DatabaseIcon, XIcon, ShieldAlertIcon } from 'lucide-react';

export default function PCBox() {
  const [box, setBox] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchBox = async () => {
    setLoading(true);
    const res = await getBoxPokemon();
    if (res.success && res.data) {
      setBox(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBox();
    const handleCaught = () => fetchBox();
    window.addEventListener('pokemon-caught', handleCaught);
    return () => window.removeEventListener('pokemon-caught', handleCaught);
  }, []);

  return (
    <section className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg w-full relative h-full flex flex-col">
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 shrink-0">
        <h3 className="text-xl font-manrope font-bold flex items-center gap-3 text-white/90 tracking-tight">
          <DatabaseIcon className="text-neutral-400" size={20} />
          Caja Almacenamiento
        </h3>
        <span className="text-xs font-inter text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-white/5">
          {box.length} {box.length === 1 ? 'Espécimen' : 'Especímenes'}
        </span>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 flex-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-neutral-900 rounded-xl border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : box.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-neutral-500 py-12">
          <ShieldAlertIcon size={40} className="opacity-40" />
          <p className="font-inter text-sm text-center max-w-[200px] leading-relaxed">Caja vacía. Comience a transferir especies desde el buscador.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
          {box.map((p: any) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="relative aspect-square bg-neutral-900/50 rounded-xl border border-white/5 hover:border-neutral-500/50 hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              aria-label={`Ver detalles de ${p.name}`}
            >
              <img 
                src={p.image_url} 
                alt={`Miniatura de ${p.name}`} 
                className="w-14 h-14 object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500" 
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-neutral-950/90 py-1.5 px-2 border-t border-white/5 text-[9px] font-inter font-medium uppercase tracking-wider text-center text-neutral-300 truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {p.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto overscroll-contain flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <article 
            className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 w-full max-w-sm relative shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-neutral-900 hover:bg-neutral-800 p-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Cerrar modal"
            >
              <XIcon size={16} />
            </button>
            
            <header className="flex flex-col items-center mb-6">
              <div className="w-28 h-28 bg-neutral-900 rounded-[2rem] flex items-center justify-center mb-5 border border-white/5 shadow-inner">
                <img src={selected.image_url} alt={selected.name} className="w-20 h-20 object-contain drop-shadow-md" />
              </div>
              <h2 className="text-2xl font-manrope font-bold text-white mb-2 text-center w-full break-words capitalize">
                {selected.name}
              </h2>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 font-semibold px-3 py-1 rounded-md border border-neutral-700 uppercase tracking-widest">
                {selected.type}
              </span>
            </header>

            <div className="bg-neutral-950/50 p-5 rounded-xl border border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs font-inter mb-2 text-neutral-400">
                <div className="bg-neutral-900/50 p-2.5 rounded-lg text-center border border-neutral-800/50">
                  <span className="block text-neutral-500 text-[10px] mb-1 font-medium tracking-wide">Altura</span>
                  <span className="text-neutral-200">{selected.height / 10} m</span>
                </div>
                <div className="bg-neutral-900/50 p-2.5 rounded-lg text-center border border-neutral-800/50">
                  <span className="block text-neutral-500 text-[10px] mb-1 font-medium tracking-wide">Peso</span>
                  <span className="text-neutral-200">{selected.weight / 10} kg</span>
                </div>
              </div>

              {selected.stats_json && (() => {
                const stats = JSON.parse(selected.stats_json);
                return [
                  { label: 'HP', val: stats.hp, bg: 'bg-emerald-500' },
                  { label: 'ATK', val: stats.attack, bg: 'bg-rose-500' },
                  { label: 'DEF', val: stats.defense, bg: 'bg-sky-500' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3" title={`${s.label}: ${s.val}`}>
                    <span className="w-8 text-[10px] font-semibold text-neutral-500">{s.label}</span>
                    <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className={`h-full ${s.bg} rounded-full`} style={{ width: `${Math.min(100, (s.val / 200) * 100)}%` }} />
                    </div>
                    <span className="w-7 text-[10px] font-inter text-neutral-300 text-right">{s.val}</span>
                  </div>
                ));
              })()}
            </div>
            
            <footer className="mt-5 pt-3 border-t border-neutral-800/50">
              <p className="text-[10px] text-center text-neutral-500 font-inter tracking-wide">
                Capturado el {new Date(selected.captured_at).toLocaleDateString()}
              </p>
            </footer>
          </article>
        </div>
      )}
    </section>
  );
}
