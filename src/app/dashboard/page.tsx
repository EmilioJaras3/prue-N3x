import { getCurrentUser } from '@/restructurado/backend/actions/auth.actions';
import PCBox from '@/restructurado/frontend/components/dashboard/PCBox';
import PokedexWidget from '@/restructurado/frontend/components/dashboard/PokedexWidget';
import PokemonSearch from '@/restructurado/frontend/components/dashboard/PokemonSearch';
import { redirect } from 'next/navigation';
import { PowerIcon, GlobeIcon, SearchIcon, UserIcon, ShieldCheckIcon, FingerprintIcon } from 'lucide-react';
import { logoutAction } from '@/restructurado/backend/actions/auth.actions';

import RegionSelector from '@/restructurado/frontend/components/dashboard/RegionSelector';

export default async function DashboardPage() {
  const result = await getCurrentUser();

  if (!result.success || !result.data) {
    redirect('/login');
  }

  const user = result.data;

  async function handleLogout() {
    'use server';
    await logoutAction();
    redirect('/login');
  }

  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Desconocida';

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-700">
      <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center border border-white/10 text-neutral-300 font-semibold text-lg shadow-inner shrink-0">
              {(user.full_name || user.username || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-lg font-bold font-manrope text-white tracking-tight capitalize">{user.full_name || user.username}</h1>
                <span className="bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px] px-2 py-0.5 rounded-md font-medium tracking-wide flex items-center gap-1">
                  <ShieldCheckIcon size={12} className="text-emerald-500" />
                  Verificado
                </span>
              </div>
              <p className="text-neutral-500 text-xs font-inter flex items-center gap-1">
                Miembro desde {joinDate}
              </p>
            </div>
          </div>

          <form action={handleLogout}>
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/5 hover:border-white/10 rounded-lg transition-all duration-300 font-inter text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400">
              <PowerIcon size={14} />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </form>
        </div>

        <div className="border-t border-white/5 bg-neutral-950/50 px-6 py-3 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <UserIcon size={14} className="text-neutral-500" />
            <span className="text-xs text-neutral-400 font-inter">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-xs text-neutral-400 font-inter">Conexión Segura</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
      <section className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-lg relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 border-b border-white/5 pb-4 relative z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <GlobeIcon className="text-neutral-500 group-hover:text-neutral-300 transition-colors" size={20} />
            <h2 className="text-base font-semibold font-manrope text-white/90 tracking-tight">Análisis de Especies</h2>
          </div>
          <div className="w-full sm:ml-auto flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0">
            <RegionSelector />
            <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-1 rounded-md border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-neutral-400 font-inter font-medium uppercase tracking-wide">Status Activo</span>
            </div>
          </div>
        </div>
        <PokedexWidget />
      </section>

          <section className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 relative z-10">
              <SearchIcon className="text-neutral-500 group-hover:text-neutral-300 transition-colors" size={20} />
              <h2 className="text-base font-semibold font-manrope text-white/90 tracking-tight">Localizador</h2>
              <span className="ml-auto text-[10px] text-neutral-400 font-inter font-medium uppercase tracking-wide bg-neutral-900 border border-white/5 px-2 py-0.5 rounded-md">Búsqueda Global</span>
            </div>
            <PokemonSearch />
          </section>
        </div>

        <div className="lg:col-span-1 h-full min-h-[500px]">
          <aside className="h-full rounded-2xl flex flex-col relative overflow-hidden">
            <PCBox />
          </aside>
        </div>
      </div>
    </div>
  );
}
