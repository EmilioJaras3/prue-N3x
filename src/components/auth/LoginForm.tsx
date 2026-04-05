'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/api/actions/auth.actions';
import { LockIcon, MailIcon, Loader2Icon } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <div className="bg-black/40 backdrop-blur-3xl border border-red-500/20 rounded-3xl p-8 shadow-[0_0_80px_rgba(255,0,0,0.15)] relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all duration-700" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-900/40 rounded-full blur-3xl transition-all duration-700" />
        
        <div className="relative z-10">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
            <LockIcon className="text-red-500" size={28} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 font-space tracking-tight">Portal de Entrenador</h2>
          <p className="text-white/60 text-sm mb-6 font-manrope">
            Ingresa tu ID Universal y Clave Secreta para enlazar tu Pokédex.
          </p>

          {apiDown && (
            <div className="bg-orange-900/40 border border-orange-500/30 text-orange-200 text-xs px-4 py-3 rounded-xl mb-6 flex gap-3 font-mono leading-relaxed shadow-[0_0_10px_rgba(249,115,22,0.1)]">
              <span className="text-lg">⚠️</span> 
              <div>
                <strong className="block text-orange-400 mb-0.5 tracking-widest">AVISO DE MANTENIMIENTO</strong>
                La Pokédex Mundial (PokéAPI) no responde. Ciertas funciones como el escáner estarán inhabilitadas tras iniciar sesión.
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/40 border border-red-500/50 text-red-100 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-shake backdrop-blur-md shadow-[0_0_10px_rgba(255,0,0,0.3)]">
              <span className="text-xl">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-red-200/70 text-xs font-bold tracking-widest uppercase ml-1">ID Universal (Correo)</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500/50" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="entrenador@kanto.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all disabled:opacity-50 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-red-200/70 text-xs font-bold tracking-widest uppercase ml-1">Clave Secreta</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500/50" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^[a-zA-Z0-9\.]*$/.test(val)) {
                      setPassword(val);
                    }
                  }}
                  placeholder="Autorización nivel 6 requerida"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all disabled:opacity-50 font-mono text-sm tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 6}
              className="w-full py-4 mt-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-neutral-800 disabled:to-neutral-900 text-white font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 border border-red-400/30 font-space"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin text-white" size={20} />
                  <span>Estableciendo conexión...</span>
                </>
              ) : (
                'Vincular Pokédex'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-red-500/10 text-center">
            <p className="text-white/40 text-sm font-manrope">
              ¿No tienes ID de Entrenador?{' '}
              <a href="/register" className="text-red-400 hover:text-red-300 font-bold transition-colors">
                Registrar Investigador
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
