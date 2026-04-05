'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/api/actions/auth.actions';
import { LockIcon, MailIcon, Loader2Icon } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
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
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-700" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/30">
            <LockIcon className="text-cyan-400" size={24} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 font-manrope tracking-tight">Acceso Seguro</h2>
          <p className="text-white/50 text-sm mb-8">
            Ingresa tus credenciales para continuar.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-3 rounded-xl mb-6 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-white/70 text-sm font-medium ml-1">Correo electrónico</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-white/70 text-sm font-medium ml-1">Contraseña</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^[a-zA-Z0-9\.]*$/.test(val)) {
                      setPassword(val);
                    }
                  }}
                  placeholder="Mínimo 6 caracteres"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 6}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-800 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" size={20} />
                  <span>Verificando...</span>
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/40 text-sm">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Crear cuenta
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
