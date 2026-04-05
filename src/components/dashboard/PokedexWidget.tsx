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
    <div className="bg-black/60 backdrop-blur-3xl border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group shadow-[inset_0_0_50px_rgba(255,0,0,0.05)]">
      {/* Efectos de fondo dark/hacker */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-[50px] -z-10 group-hover:bg-red-500/30 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-[40px] -z-10" />

      <div className="flex justify-between items-center mb-6 border-b border-red-500/20 pb-4">
        <h3 className="text-lg font-space font-bold flex items-center gap-2 text-white tracking-widest uppercase">
          <ScanIcon className="text-red-500" size={20} />
          <span>Archivo Escáner</span>
        </h3>
        <button 
          onClick={loadPokemon}
          disabled={loading}
          className="text-xs bg-red-500/10 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all border border-red-500/30 disabled:opacity-50 flex items-center gap-2 font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,0,0.2)]"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <ActivityIcon size={14} className="text-red-400" />
          )}
          {loading ? 'DEDIFICANDO...' : 'ESCANEAR'}
        </button>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center animate-fade-in group">
          <div className="w-16 h-16 bg-red-900/40 border border-red-500/50 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(255,0,0,0.3)] group-hover:scale-105 transition-transform">
            <ShieldAlertIcon size={32} className="text-red-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-red-400 font-bold font-space uppercase tracking-widest">⚠️ ERROR CRÍTICO</h4>
            <p className="text-red-200/70 text-sm font-mono max-w-sm">Conexión con PokéAPI perdida. Reintentando señal al servidor de Bill...</p>
            <p className="text-red-500/50 text-[10px] uppercase tracking-widest mt-2 block">[ ERROR TYPE: NETWORK_UNREACHABLE ]</p>
          </div>
        </div>
      ) : loading && !pokemon ? (
        <div className="h-48 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <ScanIcon className="text-cyan-400 animate-[spin_3s_linear_infinite]" size={40} />
            <p className="text-cyan-400/70 text-xs font-mono uppercase tracking-widest animate-pulse">Sensores inactivos. Esperando escaneo...</p>
          </div>
        </div>
      ) : pokemon ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-32 h-32 mx-auto md:mx-0 bg-gradient-to-b from-red-500/20 to-black/80 rounded-xl border border-red-500/30 flex items-center justify-center p-2 group-hover:shadow-[0_0_30px_rgba(255,0,0,0.3)] transition-all">
            <img 
              src={pokemon.image} 
              alt={pokemon.name} 
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]"
            />
            <div className="absolute top-2 left-2 text-[10px] text-red-300 font-mono tracking-widest font-bold">
              ID::{String(pokemon.id).padStart(3, '0')}
            </div>
            <div className="absolute bottom-2 right-2 text-[8px] text-cyan-400 font-mono uppercase tracking-widest bg-cyan-900/30 px-1 border border-cyan-500/30">
              SCAN OK
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-3xl font-bold font-space text-white uppercase tracking-wider flex items-center gap-3">
                {pokemon.name}
                <div className="h-0.5 flex-1 bg-gradient-to-r from-red-500/50 to-transparent"></div>
              </h4>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase bg-red-500/20 text-red-200 px-3 py-1 rounded-sm border border-red-500/50 tracking-widest shadow-[0_0_10px_rgba(255,0,0,0.2)]">
                  TYPE: {pokemon.type}
                </span>
                <span className="text-[10px] font-bold uppercase bg-white/5 text-neutral-300 px-3 py-1 rounded-sm border border-white/20 tracking-widest">
                  WT: {pokemon.weight / 10}kg
                </span>
                <span className="text-[10px] font-bold uppercase bg-white/5 text-neutral-300 px-3 py-1 rounded-sm border border-white/20 tracking-widest">
                  HT: {pokemon.height / 10}m
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5">
              <div className="text-xs text-cyan-400 font-mono mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse blur-[1px]"></span>
                MATRIZ DE STATS BASE
              </div>
              
              {[
                { label: 'HP', val: pokemon.stats.hp, max: 200, color: 'bg-red-500', text: 'text-red-400' },
                { label: 'ATK', val: pokemon.stats.attack, max: 200, color: 'bg-orange-500', text: 'text-orange-400' },
                { label: 'DEF', val: pokemon.stats.defense, max: 200, color: 'bg-blue-500', text: 'text-blue-400' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 text-[10px] font-bold font-space tracking-widest ${stat.text}`}>{stat.label}</div>
                  <div className="flex-1 h-3 bg-black/80 rounded-sm border border-white/10 overflow-hidden relative">
                    {/* Tick marks pattern for radar look */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjEwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50 z-10" />
                    <div className={`h-full ${stat.color} shadow-[0_0_10px_currentColor] relative z-0`} style={{ width: `${Math.min(100, (stat.val / stat.max) * 100)}%` }} />
                  </div>
                  <div className="w-8 text-[10px] text-right font-mono text-white font-bold">{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
