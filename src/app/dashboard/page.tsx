import { getCurrentUser } from '@/app/api/actions/auth.actions';
import ActionLogs from '@/components/dashboard/ActionLogs';
import ExternalData from '@/components/dashboard/ExternalData';
import { redirect } from 'next/navigation';
import { PowerIcon, ShieldCheckIcon, ActivityIcon, GlobeIcon } from 'lucide-react';
import { logoutAction } from '@/app/api/actions/auth.actions';

export default async function DashboardPage() {
  const result = await getCurrentUser();

  if (!result.success || !result.data) {
    redirect('/login');
  }

  const user = result.data;

  // Logout wrapper for revalidation
  async function handleLogout() {
    'use server';
    await logoutAction();
    redirect('/login');
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 space-y-6">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-manrope">Panel Seguro</h1>
            <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider">
              PRO VAULT
            </span>
          </div>
          <p className="text-white/50 text-sm">
            Bienvenido, <span className="text-white font-medium">{user.full_name || user.username}</span>
          </p>
        </div>

        <form action={handleLogout}>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-xl transition-all duration-200">
            <PowerIcon size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </form>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats/Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* OWASP Security Checklist Card */}
          <section className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <ShieldCheckIcon className="text-emerald-400" size={24} />
              <h2 className="text-lg font-bold font-manrope">Estado de Seguridad OWASP</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'A03 - Injection Prevention', status: 'Passed', details: 'Drizzle Parameterized Queries' },
                { label: 'A07 - Auth Failures Protection', status: 'Passed', details: 'Bcrypt + JWT (HS256)' },
                { label: 'Rate Limiting Active', status: 'Passed', details: 'Login: 5 attempts / 15m' },
                { label: 'Input Sanitization', status: 'Passed', details: 'Zod XSS Filter Pattern' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-sm font-medium">{item.label}</span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                      {item.status}
                    </span>
                  </div>
                  <span className="text-white/40 text-xs">{item.details}</span>
                </div>
              ))}
            </div>
          </section>

          {/* External Data Simulation */}
          <section className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <GlobeIcon className="text-cyan-400" size={24} />
              <h2 className="text-lg font-bold font-manrope">Integración API Externa</h2>
            </div>
            <ExternalData />
          </section>
        </div>

        {/* Sidebar: Activity Logs */}
        <div className="lg:col-span-1">
          <aside className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <ActivityIcon className="text-amber-400" size={24} />
              <h2 className="text-lg font-bold font-manrope">Auditoría de Acciones</h2>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[600px] pr-2">
              <ActionLogs />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
