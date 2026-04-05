'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/api/actions/auth.actions';

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
        setError(result.error || 'Error al iniciar sesion');
      }
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-1">Iniciar Sesion</h2>
        <p className="text-white/60 text-sm mb-6">
          Ingresa tus credenciales para acceder
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-1.5">
              Contrasena (hexadecimal)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^[0-9a-fA-F]*$/.test(val)) {
                  setPassword(val);
                }
              }}
              placeholder="Ej: a1b2c3"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition disabled:opacity-50"
            />
            <p className="text-white/40 text-xs mt-1">
              Solo caracteres 0-9 y a-f, minimo 6
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || password.length < 6}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/30 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-6">
          No tienes cuenta?{' '}
          <a href="/register" className="text-cyan-400 hover:text-cyan-300 transition">
            Registrate
          </a>
        </p>
      </div>
    </div>
  );
}
