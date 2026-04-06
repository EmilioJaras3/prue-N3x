'use client';

import { useState, useEffect } from 'react';
import { fetchRandomPokemon, PokemonData } from '@/restructurado/backend/actions/pokemon.actions';
import { ScanIcon, ShieldAlertIcon, ActivityIcon, FingerprintIcon } from 'lucide-react';
import { usePokemonStore } from '@/restructurado/frontend/store/pokemonStore';
import PokedexSkeleton from './PokedexSkeleton';

export default function PokedexWidget() {
  const { getRegionRange, selectedRegion } = usePokemonStore();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPokemon = async () => {
    setLoading(true);
    setError('');
    const { min, max } = getRegionRange();
    const res = await fetchRandomPokemon(min, max);
    if (res.success && res.data) {
      setPokemon(res.data);
    } else {
      setError(res.error || 'Error desconocido');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPokemon();
  }, [selectedRegion]);

  return (
    <article className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-lg">
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-white/10 to-transparent" />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-manrope font-semibold flex items-center gap-2 text-white/80 tracking-wide">
          <FingerprintIcon className="text-neutral-400" size={16} />
          <span>Análisis de Espécimen</span>
        </h3>
        <button 
          onClick={loadPokemon}
          disabled={loading}
          className="text-xs bg-white/5 hover:bg-white/10 text-white/90 px-3 py-1.5 rounded-md transition-all border border-white/10 disabled:opacity-50 flex items-center gap-2 font-inter focus-visible:ring-2 focus-visible:ring-neutral-400 focus:outline-none"
          aria-live="polite"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <ActivityIcon size={14} className="text-neutral-400" />
          )}
          {loading ? 'Consultando…' : 'Escanear'}
        </button>
      </div>

      <div className="min-h-[220px] transition-all duration-500 ease-in-out" aria-live="polite">
        {error ? (
          <div className="flex flex-col items-center justify-center gap-4 h-full text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center">
              <ShieldAlertIcon size={24} className="text-neutral-500" />
            </div>
            <div className="space-y-1">
              <h4 className="text-neutral-300 font-semibold font-manrope text-sm">Error de conexión</h4>
              <p className="text-neutral-500 text-xs font-inter max-w-sm">No se pudo acceder a la red de Kanto. Intente nuevamente.</p>
            </div>
          </div>
        ) : loading && !pokemon ? (
          <PokedexSkeleton />
        ) : pokemon ? (
          <div className="flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Imagen Minimalista */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 mx-auto md:mx-0 bg-neutral-900/50 rounded-[2rem] border border-white/5 flex items-center justify-center p-4">
              <img 
                src={pokemon.image} 
                alt={`Imagen oficial de ${pokemon.name}`} 
                width={128}
                height={128}
                className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 text-[10px] text-neutral-500 font-inter font-medium">
                #{String(pokemon.id).padStart(3, '0')}
              </div>
            </div>
            
            {/* Datos */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div>
                <h4 className="text-2xl font-bold font-manrope text-white capitalize tracking-tight flex items-baseline gap-3">
                  <span className="truncate" title={pokemon.name}>{pokemon.name}</span>
                  <span className="text-xs font-medium bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full border border-neutral-700 uppercase tracking-widest">
                    {pokemon.type}
                  </span>
                </h4>
                
                {pokemon.description && (
                  <p className="mt-2 text-sm text-neutral-400 font-inter leading-relaxed line-clamp-2">
                    {pokemon.description}
                  </p>
                )}

                <div className="flex gap-4 mt-4 text-xs font-inter text-neutral-500">
                  <span className="flex items-center gap-1.5"><strong className="text-neutral-300">Peso:</strong> {pokemon.weight / 10}kg</span>
                  <span className="flex items-center gap-1.5"><strong className="text-neutral-300">Altura:</strong> {pokemon.height / 10}m</span>
                </div>
              </div>

              {/* Matriz de Stats (Minimalista) */}
              <div className="pt-2">
                <div className="text-[10px] text-neutral-500 font-inter tracking-widest uppercase mb-3 font-semibold">
                  Métricas Base
                </div>
                
                <div className="grid gap-3">
                  {[
                    { label: 'HP', val: pokemon.stats.hp, max: 200, color: 'bg-emerald-500/80' },
                    { label: 'ATK', val: pokemon.stats.attack, max: 200, color: 'bg-rose-500/80' },
                    { label: 'DEF', val: pokemon.stats.defense, max: 200, color: 'bg-sky-500/80' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 text-[10px] font-semibold text-neutral-400">{stat.label}</div>
                      <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${Math.min(100, (stat.val / stat.max) * 100)}%` }} />
                      </div>
                      <div className="w-6 text-[10px] text-right font-inter text-neutral-300">{stat.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
