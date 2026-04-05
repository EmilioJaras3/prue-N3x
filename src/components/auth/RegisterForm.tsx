'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/app/api/actions/auth.actions';

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function updateField(field: string, value: string) {
    // filtrar caracteres no permitidos segun campo
    if (field === 'username' && value !== '' && !/^[a-zA-Z0-9_-]*$/.test(value)) return;
    if (field === 'full_name' && value !== '' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]*$/.test(value)) return;
    if (field === 'password' && value !== '' && !/^[0-9a-fA-F]*$/.test(value)) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const checks = {
    minLength: form.password.length >= 6,
    isHex: /^[0-9a-fA-F]*$/.test(form.password),
  };
  const passwordValid = checks.minLength && checks.isHex;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await registerAction(form);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(result.error || 'Error en el registro');
      }
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-emerald-400">Registro exitoso</h2>
          <p className="text-white/60 mt-2">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-1">Crear Cuenta</h2>
        <p className="text-white/60 text-sm mb-6">Completa los datos para registrarte</p>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-1.5">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => updateField('username', e.target.value)}
              placeholder="mi_usuario"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition disabled:opacity-50"
            />
            <p className="text-white/40 text-xs mt-1">Letras, numeros, guiones</p>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-1.5">Nombre completo</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              placeholder="Juan Perez"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-1.5">
              Contrasena (hexadecimal)
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Ej: a1b2c3d4e5f6"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition disabled:opacity-50"
            />
            <div className="mt-2 space-y-1">
              <div className={`flex items-center gap-2 text-xs ${checks.minLength ? 'text-emerald-400' : 'text-white/40'}`}>
                <span>{checks.minLength ? '●' : '○'}</span> Minimo 6 caracteres
              </div>
              <div className={`flex items-center gap-2 text-xs ${checks.isHex ? 'text-emerald-400' : 'text-white/40'}`}>
                <span>{checks.isHex ? '●' : '○'}</span> Solo hexadecimal (0-9, a-f)
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !passwordValid}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/30 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-6">
          Ya tienes cuenta?{' '}
          <a href="/login" className="text-cyan-400 hover:text-cyan-300 transition">
            Inicia sesion
          </a>
        </p>
      </div>
    </div>
  );
}
