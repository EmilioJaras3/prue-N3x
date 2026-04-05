'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/app/api/actions/auth.actions';
import { UserIcon, MailIcon, LockIcon, ShieldCheckIcon, Loader2Icon, ArrowRightIcon } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const result = await registerAction(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(result.error || 'Ocurrió un error al crear la cuenta');
      }
    } catch {
      setError('No se pudo conectar con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md bg-emerald-500/10 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-10 text-center animate-fade-in shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
          <ShieldCheckIcon className="text-emerald-400" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 font-manrope">¡Cuenta creada!</h2>
        <p className="text-emerald-400/70">Tu cuenta ha sido registrada correctamente. Redirigiendo al inicio de sesión...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
              <UserIcon className="text-cyan-400" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-manrope tracking-tight">Crear Cuenta</h2>
              <p className="text-white/40 text-xs">Completa los campos para registrarte</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-1 space-y-2">
              <label className="text-white/70 text-xs font-semibold ml-1">Usuario</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="text"
                  placeholder="ej: mi_usuario"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/40 outline-none transition-all placeholder:text-white/20"
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-white/70 text-xs font-semibold ml-1">Nombre Completo</label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/40 outline-none transition-all placeholder:text-white/20"
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-white/70 text-xs font-semibold ml-1">Correo Electrónico</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/40 outline-none transition-all placeholder:text-white/20"
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-white/70 text-xs font-semibold ml-1">Contraseña</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  value={formData.password}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/40 outline-none transition-all placeholder:text-white/20"
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || /^[a-zA-Z0-9\.]*$/.test(val)) {
                      setFormData({ ...formData, password: val });
                    }
                  }}
                />
              </div>
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading || formData.password.length < 6}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-800 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
              >
                {loading ? (
                  <Loader2Icon className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Crear Cuenta</span>
                    <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <footer className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/30 text-sm">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4 decoration-cyan-500/30">
                Iniciar Sesión
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
