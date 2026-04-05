'use client';

import { useState, useEffect } from 'react';
import { getBoxPokemon, PokemonData } from '@/app/api/actions/pokemon.actions';
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

    // Listen to custom event when a pokemon is caught
    const handleCaught = () => fetchBox();
    window.addEventListener('pokemon-caught', handleCaught);
    return () => window.removeEventListener('pokemon-caught', handleCaught);
  }, []);

  return (
    <div className="bg-black/60 backdrop-blur-3xl border border-red-500/20 rounded-2xl p-6 shadow-[inset_0_0_50px_rgba(255,0,0,0.05)] w-full relative">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <h3 className="text-xl font-space font-bold flex items-center gap-3 text-white tracking-widest uppercase">
          <DatabaseIcon className="text-red-500" size={24} />
          Caja PC de Bill
        </h3>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-sm border border-cyan-500/30">
          [{box.length}] ESPÉCIMENES
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : box.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center gap-4 text-white/30">
          <ShieldAlertIcon size={40} className="opacity-50" />
          <p className="font-mono text-sm uppercase tracking-widest">Caja PC vacía. Atrapa tu primer Pokémon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {box.map((p: any) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="relative aspect-square bg-gradient-to-b from-white/10 to-transparent rounded-xl border border-white/10 hover:border-red-500/50 hover:from-red-500/20 transition-all flex items-center justify-center group overflow-hidden"
            >
              <img src={p.image_url} alt={p.name} className="w-16 h-16 object-contain filter drop-shadow-[0_0_10px_rgba(255,0,0,0.3)] group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1 px-2 border-t border-white/10 text-[9px] font-mono font-bold uppercase tracking-widest text-center truncate">
                {p.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal de Stats */}
      {selected && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-[#0f0f0f] border-2 border-red-500/50 rounded-2xl p-6 w-full max-w-sm relative shadow-[0_0_50px_rgba(255,0,0,0.3)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 hover:bg-red-500/20 p-2 rounded-full transition-all"
            >
              <XIcon size={16} />
            </button>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-b from-red-500/20 to-black rounded-full border border-red-500/30 flex items-center justify-center mb-4 relative drop-shadow-[0_0_30px_rgba(255,0,0,0.2)]">
                <img src={selected.image_url} alt={selected.name} className="w-24 h-24 object-contain" />
              </div>
              <h2 className="text-2xl font-space font-bold uppercase tracking-widest text-white mb-1">
                {selected.name}
              </h2>
              <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-3 py-1 rounded-sm border border-red-500/30 uppercase tracking-widest">
                {selected.type}
              </span>
            </div>

            <div className="bg-black/60 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                DATOS BIOMÉTRICOS DEL PC
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4 text-white/70">
                <div className="bg-white/5 p-2 rounded text-center">
                  <span className="block text-white/40 text-[9px]">ALTURA</span>
                  {selected.height / 10} m
                </div>
                <div className="bg-white/5 p-2 rounded text-center">
                  <span className="block text-white/40 text-[9px]">PESO</span>
                  {selected.weight / 10} kg
                </div>
              </div>

              {selected.stats_json && (() => {
                const stats = JSON.parse(selected.stats_json);
                return [
                  { label: 'HP', val: stats.hp, bg: 'bg-red-500' },
                  { label: 'ATK', val: stats.attack, bg: 'bg-orange-500' },
                  { label: 'DEF', val: stats.defense, bg: 'bg-blue-500' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-8 text-[10px] font-bold text-white/50">{s.label}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${s.bg}`} style={{ width: `${Math.min(100, (s.val / 200) * 100)}%` }} />
                    </div>
                    <span className="w-6 text-[10px] font-mono text-right">{s.val}</span>
                  </div>
                ));
              })()}
            </div>
            
            <p className="text-[9px] text-center mt-4 mb-2 text-white/20 font-mono uppercase tracking-[0.3em]">
              Sincronizado: {new Date(selected.captured_at).toLocaleDateString()}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-4 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 font-mono text-[10px] tracking-widest uppercase rounded-xl transition-all font-bold"
            >
              Volver a la Caja
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
