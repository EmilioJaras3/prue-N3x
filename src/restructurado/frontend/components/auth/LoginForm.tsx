'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/restructurado/backend/actions/auth.actions';
import { LockIcon, MailIcon, Loader2Icon } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState('');
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

    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'El ID Universal es obligatorio';
    if (!password) newErrors.password = 'La Clave Secreta es obligatoria';
    else if (password.length < 6) newErrors.password = 'La clave debe tener al menos 6 caracteres';

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await loginAction({ email, password });
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Ocurrió un error al iniciar sesión');
      }
    } catch {
      setError('No se pudo conectar con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="glass-card-light rounded-[2.5rem] p-10 relative overflow-hidden group">
        {/* Decorative Orbs inside card */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl group-hover:bg-yellow-300/30 transition-all duration-700" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl transition-all duration-700" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-200 shadow-sm">
            <LockIcon className="text-blue-600" size={32} />
          </div>
          
          <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">¡Hola de nuevo!</h2>
          <p className="text-gray-600 text-sm mb-8 font-manrope font-semibold">
            Entra a tu terminal y sigue tu aventura.
          </p>

          {apiDown && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-4 py-3 rounded-2xl mb-6 flex gap-3 font-semibold shadow-sm animate-fade-in">
              <span className="text-amber-500">⚠️</span>
              <p>La red global PokéAPI está bajo mantenimiento. Algunas visualizaciones podrían tardar.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-2xl mb-8 flex items-center gap-3 animate-shake font-bold shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-400 text-[11px] font-bold tracking-widest uppercase ml-1">Correo del Entrenador</label>
              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  placeholder="ash@paleta.com"
                  disabled={loading}
                  autoComplete="email"
                  onInvalid={e => e.preventDefault()}
                  className={`w-full pl-12 pr-6 py-4 bg-white/40 border-2 ${fieldErrors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-100/50'} rounded-2xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all disabled:opacity-50 font-medium`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2 mt-1 animate-fade-in">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-400 text-[11px] font-bold tracking-widest uppercase ml-1">Clave Secreta</label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^[a-zA-Z0-9\.]*$/.test(val)) {
                      setPassword(val);
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                    }
                  }}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  onInvalid={e => e.preventDefault()}
                  className={`w-full pl-12 pr-6 py-4 bg-white/40 border-2 ${fieldErrors.password ? 'border-red-400 bg-red-50/30' : 'border-gray-100/50'} rounded-2xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all disabled:opacity-50 font-medium`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2 mt-1 animate-fade-in">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 6}
              className="w-full py-5 mt-4 bg-gradient-to-r from-yellow-400 via-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 text-amber-950 font-bold tracking-wide uppercase rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(251,191,36,0.2)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.3)] active:scale-[0.97] flex items-center justify-center gap-2 border border-yellow-200"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin text-amber-900" size={22} />
                  <span className="font-bold">Conectando...</span>
                </>
              ) : (
                'Acceder a la Base'
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm font-medium">
              ¿Eres un nuevo investigador?{' '}
              <a href="/register" className="text-blue-500 hover:text-blue-600 font-bold underline-offset-4 hover:underline transition-all">
                Crea tu cuenta
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
