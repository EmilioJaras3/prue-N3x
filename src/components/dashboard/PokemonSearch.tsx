'use client';

import { useState } from 'react';
import { searchPokemonByName, PokemonData, savePokemonToBox } from '@/app/api/actions/pokemon.actions';
import { SearchIcon, XIcon, Loader2Icon } from 'lucide-react';

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
      setError(res.error || 'Pokémon no encontrado');
    }
    setLoading(false);
  };

  const handleCatch = async () => {
    if (!result) return;
    setSaving(true);
    const res = await savePokemonToBox(result);
    if (res.success) {
      setSuccessMsg(`¡${result.name.toUpperCase()} fue transferido al PC!`);
      // Emit event to update PC Box list automatically
      window.dispatchEvent(new Event('pokemon-caught'));
    } else {
      setError(res.error || 'Error al atrapar');
    }
    setSaving(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500/50" size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="pikachu, charizard, mewtwo..."
            className="w-full pl-10 pr-10 py-3 bg-black/60 border border-white/10 rounded-xl text-white text-sm font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all placeholder:text-white/20"
            disabled={loading}
          />
          {query && (
            <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              <XIcon size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-3 bg-red-500/10 hover:bg-red-500/30 text-white border border-red-500/30 rounded-xl transition-all font-mono text-xs uppercase tracking-widest disabled:opacity-50 shadow-[0_0_15px_rgba(255,0,0,0.15)] flex items-center gap-2"
        >
          {loading ? <Loader2Icon className="animate-spin" size={14} /> : <SearchIcon size={14} />}
          Buscar
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-xl flex items-center gap-2 font-mono">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Message */}
      {successMsg && (
        <div className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-200 text-sm px-4 py-3 rounded-xl flex items-center gap-2 font-mono">
          <span>✅</span> {successMsg}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5 hover:border-red-500/20 transition-colors animate-fade-in relative overflow-hidden group">
          <div className="w-20 h-20 shrink-0 bg-gradient-to-b from-red-500/20 to-black/80 rounded-xl border border-red-500/20 flex items-center justify-center p-1">
            <img src={result.image} alt={result.name} className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,0,0,0.4)]" />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[10px] text-red-400 font-mono">#{String(result.id).padStart(3, '0')}</span>
              <h4 className="text-lg font-bold font-space text-white uppercase tracking-wider">{result.name}</h4>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3 sm:mb-0">
              <span className="text-[10px] font-bold uppercase bg-red-500/20 text-red-200 px-2 py-0.5 rounded-sm border border-red-500/40 tracking-widest">{result.type}</span>
              <span className="text-[10px] text-white/40 font-mono flex items-center">HP:{result.stats.hp} ATK:{result.stats.attack} DEF:{result.stats.defense}</span>
            </div>
          </div>
          <button
            onClick={handleCatch}
            disabled={saving || !!successMsg}
            className="w-full sm:w-auto px-6 py-3 shrink-0 bg-red-600 hover:bg-red-500 text-white font-bold font-space text-xs uppercase tracking-widest rounded-lg transition-all disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 border border-red-400 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,0,0,0.5)] flex items-center justify-center gap-2"
          >
            {saving ? <Loader2Icon className="animate-spin" size={14} /> : 'Pokéball'}
            {saving ? 'Capturando...' : successMsg ? 'En PC' : 'ATRAPAR'}
          </button>
        </div>
      )}
    </div>
  );
}
