import { getCurrentUser } from '@/app/api/actions/auth.actions';
import PCBox from '@/components/dashboard/PCBox';
import PokedexWidget from '@/components/dashboard/PokedexWidget';
import PokemonSearch from '@/components/dashboard/PokemonSearch';
import { redirect } from 'next/navigation';
import { PowerIcon, ActivityIcon, GlobeIcon, SparklesIcon, SearchIcon, ShieldCheckIcon, ClockIcon, UserIcon } from 'lucide-react';
import { logoutAction } from '@/app/api/actions/auth.actions';

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
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-6">
      <header className="bg-black/40 backdrop-blur-3xl border border-red-500/20 rounded-2xl shadow-[0_0_25px_rgba(255,0,0,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/80 to-red-500/0" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center border border-red-400/30 shadow-[0_0_20px_rgba(255,0,0,0.3)] text-white font-bold text-xl font-space">
              {(user.full_name || user.username || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl font-bold font-space uppercase tracking-widest text-white">{user.full_name || user.username}</h1>
                <span className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-widest font-mono">
                  ACCESO Ω
                </span>
              </div>
              <p className="text-white/40 text-xs font-mono tracking-widest uppercase">
                Investigador desde {joinDate}
              </p>
            </div>
          </div>

          <form action={handleLogout}>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-black/50 hover:bg-red-500/10 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-200 font-mono tracking-widest text-xs uppercase">
              <PowerIcon size={14} />
              <span className="font-bold">Desconectar</span>
            </button>
          </form>
        </div>

        <div className="border-t border-white/5 px-6 py-3 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <UserIcon size={14} className="text-red-400" />
            <span className="text-[10px] text-white/50 font-mono tracking-widest uppercase">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span className="text-[10px] text-white/50 font-mono tracking-widest uppercase">Sesión Activa</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-black/40 backdrop-blur-3xl border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-6 border-b border-red-500/20 pb-4 relative z-10">
              <GlobeIcon className="text-cyan-400" size={24} />
              <h2 className="text-lg font-bold font-space uppercase tracking-widest text-white">Escáner de Investigación</h2>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] text-cyan-400/60 font-mono tracking-widest uppercase">En línea</span>
              </div>
            </div>
            <PokedexWidget />
          </section>

          <section className="bg-black/40 backdrop-blur-3xl border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-6 border-b border-red-500/20 pb-4 relative z-10">
              <SearchIcon className="text-red-500" size={24} />
              <h2 className="text-lg font-bold font-space uppercase tracking-widest text-white">Búsqueda en Pokédex</h2>
              <span className="ml-auto text-[10px] text-red-500/60 font-mono tracking-widest uppercase bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">Nueva Función</span>
            </div>
            <PokemonSearch />
          </section>
        </div>

        <div className="lg:col-span-1">
          <aside className="h-full bg-black/40 backdrop-blur-3xl border border-red-500/20 rounded-2xl flex flex-col relative overflow-hidden">
            <PCBox />
          </aside>
        </div>
      </div>
    </div>
  );
}
