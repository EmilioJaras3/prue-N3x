'use client';

import { useState, useEffect } from 'react';
import { fetchRandomPokemon, PokemonData } from '@/app/api/actions/pokemon.actions';
import { ScanIcon, ShieldAlertIcon, ActivityIcon, DropletsIcon } from 'lucide-react';

export default function PokedexWidget() {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPokemon = async () => {
    setLoading(true);
    setError('');
    const res = await fetchRandomPokemon();
    if (res.success && res.data) {
      setPokemon(res.data);
    } else {
      setError(res.error || 'Error desconocido');
    }
    setLoading(false);
  };

  // Cargar al montar el componente
  useEffect(() => {
    loadPokemon();
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group">
      {/* Efectos de fondo dark/hacker */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] -z-10 group-hover:bg-purple-500/30 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-[40px] -z-10" />

      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 className="text-lg font-space font-bold flex items-center gap-2 text-purple-300 shadow-purple-500/50">
          <ScanIcon className="text-purple-400" size={20} />
          <span>VAULT SPECIMEN DATABASE</span>
        </h3>
        <button 
          onClick={loadPokemon}
          disabled={loading}
          className="text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 px-3 py-1.5 rounded-lg transition-all border border-purple-500/30 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <ActivityIcon size={14} />
          )}
          {loading ? 'DECODING...' : 'SCAN NEW'}
        </button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 text-red-400 p-4 bg-red-400/10 rounded-xl border border-red-400/20">
          <ShieldAlertIcon size={20} />
          <p>{error}</p>
        </div>
      ) : loading && !pokemon ? (
        <div className="h-48 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <ScanIcon className="text-purple-400 animate-pulse" size={32} />
            <p className="text-purple-400/70 text-sm font-space animate-pulse">Decrypting biometric data...</p>
          </div>
        </div>
      ) : pokemon ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-32 h-32 mx-auto md:mx-0 bg-gradient-to-b from-purple-500/20 to-transparent rounded-xl border border-purple-500/20 flex items-center justify-center p-2 group-hover:border-purple-500/50 transition-colors">
            <img 
              src={pokemon.image} 
              alt={pokemon.name} 
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            />
            <div className="absolute top-2 left-2 text-[10px] text-purple-300/50 font-mono">
              ID:{String(pokemon.id).padStart(3, '0')}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-2xl font-bold font-manrope text-white capitalize tracking-wide">
                {pokemon.name}
              </h4>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                  CLASS: {pokemon.type}
                </span>
                <span className="text-[10px] font-bold bg-white/5 text-neutral-400 px-2 py-0.5 rounded border border-white/10">
                  WT: {pokemon.weight / 10}kg
                </span>
                <span className="text-[10px] font-bold bg-white/5 text-neutral-400 px-2 py-0.5 rounded border border-white/10">
                  HT: {pokemon.height / 10}m
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-neutral-400 font-space mb-1">BIOMETRIC STATS</div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 text-[10px] font-bold text-red-400">HP</div>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, (pokemon.stats.hp / 200) * 100)}%` }} />
                </div>
                <div className="w-6 text-[10px] text-right font-mono text-white/70">{pokemon.stats.hp}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 text-[10px] font-bold text-orange-400">ATK</div>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (pokemon.stats.attack / 200) * 100)}%` }} />
                </div>
                <div className="w-6 text-[10px] text-right font-mono text-white/70">{pokemon.stats.attack}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 text-[10px] font-bold text-blue-400">DEF</div>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (pokemon.stats.defense / 200) * 100)}%` }} />
                </div>
                <div className="w-6 text-[10px] text-right font-mono text-white/70">{pokemon.stats.defense}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
