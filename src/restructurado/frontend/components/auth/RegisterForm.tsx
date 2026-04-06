'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/restructurado/backend/actions/auth.actions';
import { UserIcon, MailIcon, LockIcon, Loader2Icon, ShieldCheckIcon } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!name) newErrors.name = 'El nombre es obligatorio';
    if (!email) newErrors.email = 'El correo es obligatorio';
    if (!password) newErrors.password = 'La clave es obligatoria';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres (hexadecimal recomendado)';

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Map 'name' input to both username and full_name to satisfy the schema with 3 fields
      const result = await registerAction({ 
        username: name, 
        full_name: name,
        email, 
        password 
      });
      if (result.success) {
        router.push('/login?registered=true');
      } else {
        setError(result.error || 'No se pudo completar el registro');
      }
    } catch {
      setError('Fallo en la red del Centro Pokémon. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <div className="glass-card-light rounded-[2.5rem] p-10 relative overflow-hidden group">
        {/* Decorative Orbs */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-300/30 transition-all duration-700" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl transition-all duration-700" />
        
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-200">
              <ShieldCheckIcon className="text-amber-500" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Registro de Investigador</h2>
              <p className="text-gray-500 text-sm font-medium">Únete a la red global de expertos.</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-2xl mb-8 flex items-center gap-3 animate-shake font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-gray-400 text-[11px] font-bold tracking-widest uppercase ml-1">Nombre de Usuario</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                  }}
                  placeholder="Profesor Oak"
                  disabled={loading}
                  className={`w-full pl-12 pr-6 py-4 bg-white/40 border-2 ${fieldErrors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-100/50'} rounded-2xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all disabled:opacity-50 font-medium`}
                />
              </div>
              {fieldErrors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2">{fieldErrors.name}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-gray-400 text-[11px] font-bold tracking-widest uppercase ml-1">Identificación Digital (Email)</label>
              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  placeholder="oak@paleta.com"
                  disabled={loading}
                  onInvalid={e => e.preventDefault()}
                  className={`w-full pl-12 pr-6 py-4 bg-white/40 border-2 ${fieldErrors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-100/50'} rounded-2xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all disabled:opacity-50 font-medium`}
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-gray-400 text-[11px] font-bold tracking-widest uppercase ml-1">Clave de Encriptación (6+ Hex)</label>
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
                  placeholder="A1B2C3D4"
                  disabled={loading}
                  onInvalid={e => e.preventDefault()}
                  className={`w-full pl-12 pr-6 py-4 bg-white/40 border-2 ${fieldErrors.password ? 'border-red-400 bg-red-50/30' : 'border-gray-100/50'} rounded-2xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all disabled:opacity-50 font-medium`}
                />
              </div>
              {fieldErrors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 6}
              className="md:col-span-2 w-full py-5 mt-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 text-white font-bold tracking-widest uppercase rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.3)] active:scale-[0.97] flex items-center justify-center gap-2 border border-blue-400/20"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin text-white" size={22} />
                  <span>Cifrando Datos...</span>
                </>
              ) : (
                'Finalizar Registro'
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-sm font-medium">
              ¿Ya tienes una credencial válida?{' '}
              <a href="/login" className="text-blue-500 hover:text-blue-600 font-bold underline-offset-4 hover:underline transition-all">
                Inicia Sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
