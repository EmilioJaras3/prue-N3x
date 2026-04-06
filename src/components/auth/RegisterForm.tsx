'use client';

import { useState, useEffect } from 'react';
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
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    full_name?: string;
  }>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiDown, setApiDown] = useState(false);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/1', { method: 'HEAD', cache: 'no-store' })
      .then(res => {
        if (!res.ok && res.status >= 500) setApiDown(true);
      })
      .catch(() => setApiDown(true));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validaciones Estéticas Manuales
    const newErrors: typeof fieldErrors = {};
    if (!formData.username) newErrors.username = 'El ID de Entrenador es obligatorio';
    if (!formData.full_name) newErrors.full_name = 'El Nombre Oficial es obligatorio';
    if (!formData.email) newErrors.email = 'El correo es obligatorio';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Formato de correo inválido';
    
    if (!formData.password) newErrors.password = 'La Clave Secreta es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'La clave debe tener al menos 6 caracteres';

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setLoading(true);

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
    <div className="w-full max-w-lg mx-auto animate-fade-in text-left">
      <div className="bg-black/40 backdrop-blur-3xl border border-red-500/20 rounded-3xl p-8 shadow-[0_0_80px_rgba(255,0,0,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
              <UserIcon className="text-red-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-space tracking-tight">Registro de Investigador</h2>
              <p className="text-white/60 text-xs font-manrope tracking-widest uppercase">Base de datos de Kanto</p>
            </div>
          </div>

          {apiDown && (
            <div className="bg-orange-900/40 border border-orange-500/30 text-orange-200 text-xs px-4 py-3 rounded-xl mb-6 flex gap-3 font-mono leading-relaxed shadow-[0_0_10px_rgba(249,115,22,0.1)]">
              <div>
                <strong className="block text-orange-400 mb-0.5 tracking-widest">AVISO DE MANTENIMIENTO</strong>
                La Pokédex Mundial (PokéAPI) no responde. Ciertas funciones como el escáner estarán inhabilitadas al entrar al sistema.
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/40 border border-red-500/50 text-red-100 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-shake backdrop-blur-md shadow-[0_0_10px_rgba(255,0,0,0.3)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-1 space-y-2">
              <label className="text-red-200/70 text-xs font-bold tracking-widest uppercase ml-1">ID de Entrenador</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500/50" size={16} />
                <input
                  type="text"
                  placeholder="ej: ash_ketchum"
                  className={`w-full pl-10 pr-4 py-3 bg-black/50 border ${fieldErrors.username ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition-all placeholder:text-white/20 font-mono text-sm`}
                  onChange={e => {
                    setFormData({ ...formData, username: e.target.value });
                    if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: undefined });
                  }}
                />
              </div>
              {fieldErrors.username && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 animate-fade-in">{fieldErrors.username}</p>}
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-red-200/70 text-xs font-bold tracking-widest uppercase ml-1">Nombre Oficial</label>
              <input
                type="text"
                placeholder="Nombre en la liga"
                className={`w-full px-4 py-3 bg-black/50 border ${fieldErrors.full_name ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition-all placeholder:text-white/20 font-mono text-sm`}
                onChange={e => {
                  setFormData({ ...formData, full_name: e.target.value });
                  if (fieldErrors.full_name) setFieldErrors({ ...fieldErrors, full_name: undefined });
                }}
              />
              {fieldErrors.full_name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 animate-fade-in">{fieldErrors.full_name}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-red-200/70 text-xs font-bold tracking-widest uppercase ml-1">Frecuencia de Comunicación (Correo)</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500/50" size={16} />
                <input
                  type="email"
                  placeholder="entrenador@kanto.com"
                  className={`w-full pl-10 pr-4 py-3 bg-black/50 border ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition-all placeholder:text-white/20 font-mono text-sm`}
                  onChange={e => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 animate-fade-in">{fieldErrors.email}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-red-200/70 text-xs font-bold tracking-widest uppercase ml-1">Clave Secreta</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500/50" size={16} />
                <input
                  type="password"
                  placeholder="Autorización requerida (mín. 6)"
                  value={formData.password}
                  className={`w-full pl-10 pr-4 py-3 bg-black/50 border ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition-all placeholder:text-white/20 font-mono text-sm tracking-widest`}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || /^[a-zA-Z0-9\.]*$/.test(val)) {
                      setFormData({ ...formData, password: val });
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                    }
                  }}
                />
              </div>
              {fieldErrors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 animate-fade-in">{fieldErrors.password}</p>}
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-neutral-800 disabled:to-neutral-900 border border-red-400/30 text-white font-bold tracking-widest uppercase rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] font-space"
              >
                {loading ? (
                  <Loader2Icon className="animate-spin text-white" size={20} />
                ) : (
                  <>
                    <span>Emitir Identificación</span>
                    <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <footer className="mt-8 pt-6 border-t border-red-500/10 text-center">
            <p className="text-white/40 text-sm font-manrope">
              ¿Ya estás en la base de datos?{' '}
              <a href="/login" className="text-red-400 hover:text-red-300 font-bold underline underline-offset-4 decoration-red-500/30 transition-colors">
                Enlazar Pokédex
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
