'use client';

import { useState } from 'react';
import { searchPokemonByName, PokemonData, savePokemonToBox } from '@/restructurado/backend/actions/pokemon.actions';
import { SearchIcon, XIcon, Loader2Icon, LayersIcon } from 'lucide-react';

export default function PokemonSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<PokemonData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setSuccessMsg('');

    const res = await searchPokemonByName(query);
    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error || 'Especie no localizada.');
    }
    setLoading(false);
  };

  const handleCatch = async () => {
    if (!result) return;
    setSaving(true);
    const res = await savePokemonToBox(result);
    if (res.success) {
      setSuccessMsg(`Archivado: ${result.name.toUpperCase()}`);
      // Emitir evento para actualizar PC Box automáticamente
      window.dispatchEvent(new Event('pokemon-caught'));
    } else {
      setError(res.error || 'Error al persistir espécimen');
    }
    setSaving(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResult(null);
    setError('');
    setSuccessMsg('');
  };

  return (
    <section className="space-y-4">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-neutral-300" size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por espécimen (ej: pikachu, mewtwo...)"
            className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm font-inter focus:outline-none focus-visible:border-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-500 transition-all placeholder:text-neutral-600"
            disabled={loading}
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button 
              type="button" 
              onClick={clearSearch} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm p-0.5"
              aria-label="Limpiar búsqueda"
            >
              <XIcon size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 border border-transparent rounded-lg transition-all font-inter text-sm font-medium disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-neutral-700 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {loading ? <Loader2Icon className="animate-spin" size={16} /> : null}
          Buscar
        </button>
      </form>

      {/* Estados Transitorios (Errores/Éxito) */}
      <div aria-live="polite">
        {error && (
          <div className="bg-rose-950/30 border border-rose-900/50 text-rose-200/90 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 font-inter mt-3 animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-300 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 font-inter mt-3 animate-in fade-in slide-in-from-top-1">
            <LayersIcon size={16} className="text-emerald-500" />
            {successMsg}
          </div>
        )}
      </div>

      {/* Resultado (Tarjeta Minimalista) */}
      <div aria-live="polite" className="relative">
        {result && (
          <article className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 shadow-xl shrink-0">
            {/* Foto Minimalista */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-neutral-900/40 rounded-2xl border border-white/5 flex items-center justify-center p-3">
              <img 
                src={result.image} 
                alt={result.name} 
                className="w-full h-full object-contain filter drop-shadow-md"
                width={112}
                height={112} 
                loading="lazy"
              />
            </div>
            
            {/* Detalles */}
            <div className="flex-1 min-w-0 w-full text-center sm:text-left flex flex-col">
              <header className="flex flex-col sm:flex-row sm:items-baseline sm:justify-start gap-2 mb-2">
                <h4 className="text-xl font-bold font-manrope text-white capitalize tracking-tight shrink-0">
                  {result.name}
                </h4>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] text-neutral-500 font-inter font-medium leading-none">#{String(result.id).padStart(3, '0')}</span>
                  <span className="text-[10px] font-semibold uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700 tracking-wider">
                    {result.type}
                  </span>
                </div>
              </header>
              
              {result.description && (
                <p className="text-sm text-neutral-400 font-inter mb-4 line-clamp-2">
                  {result.description}
                </p>
              )}

              <div className="mt-auto flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 w-full">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Resumen Stats */}
                  <div className="flex items-center gap-2 border-[0.5px] border-neutral-800 bg-neutral-900/50 rounded-lg px-2.5 py-1.5 w-full sm:w-auto justify-center">
                    <div className="flex flex-col items-center px-2 border-r border-neutral-800 last:border-0">
                      <span className="text-[9px] text-neutral-500 font-semibold mb-0.5">HP</span>
                      <span className="text-xs text-neutral-300 font-mono">{result.stats.hp}</span>
                    </div>
                    <div className="flex flex-col items-center px-2 border-r border-neutral-800 last:border-0">
                      <span className="text-[9px] text-neutral-500 font-semibold mb-0.5">ATK</span>
                      <span className="text-xs text-neutral-300 font-mono">{result.stats.attack}</span>
                    </div>
                    <div className="flex flex-col items-center px-2 border-r border-neutral-800 last:border-0">
                      <span className="text-[9px] text-neutral-500 font-semibold mb-0.5">DEF</span>
                      <span className="text-xs text-neutral-300 font-mono">{result.stats.defense}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCatch}
                  disabled={saving || !!successMsg}
                  className="w-full sm:w-auto px-5 py-2.5 shrink-0 bg-neutral-800 hover:bg-neutral-700 text-white font-medium font-inter text-sm rounded-lg transition-all disabled:opacity-50 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:border-transparent border border-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2Icon className="animate-spin" size={14} /> : null}
                  {saving ? 'Transfiriendo…' : successMsg ? 'Guardado' : 'Transferir a PC'}
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
