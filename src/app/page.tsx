import Link from 'next/link';
import { ShieldCheckIcon, LockIcon, ZapIcon, BarChart3Icon } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4">
      {/* Hero Badge */}
      <div className="mb-6 animate-fade-in">
        <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full border border-cyan-500/20 tracking-widest uppercase">
          Next Gen Security
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-5xl md:text-7xl font-bold font-manrope mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-tight tracking-tighter">
        Protege tu Identidad <br /> en la Bóveda Digital
      </h1>

      <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
        Gestiona tus datos con tecnología de encriptación avanzada, 
        auditoría en tiempo real y cumplimiento de estándares OWASP. 
        Seguridad industrial para tu ecosistema digital.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-20">
        <Link 
          href="/login"
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:scale-105"
        >
          Acceder ahora
        </Link>
        <Link 
          href="/register"
          className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all duration-300 backdrop-blur-md"
        >
          Crear cuenta segura
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
        {[
          { icon: <LockIcon className="text-cyan-400" />, title: 'Encriptación Hex', desc: 'Contraseñas de grado hexadecimal.' },
          { icon: <ShieldCheckIcon className="text-emerald-400" />, title: 'Cumple OWASP', desc: 'Protección contra Inyección y XSS.' },
          { icon: <ActivityIcon className="text-amber-400" />, title: 'Auditoría Viva', desc: 'Logs de cada acción con IP y UA.' },
          { icon: <ZapIcon className="text-purple-400" />, title: 'Server Actions', desc: 'Lógica procesada 100% en el servidor.' },
        ].map((f, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
            <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
            <h3 className="font-bold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-white/40 leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="mt-20 opacity-20 flex items-center gap-6 grayscale">
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent to-white"></div>
        <LockIcon size={20} />
        <div className="h-[1px] w-32 bg-gradient-to-l from-transparent to-white"></div>
      </div>
    </div>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}
