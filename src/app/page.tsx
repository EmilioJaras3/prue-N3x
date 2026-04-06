'use client';

import { useRouter } from 'next/navigation';
import { ArrowRightIcon, ShieldIcon, ActivityIcon, GlobeIcon } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col text-gray-900 font-inter">
      {/* Dynamic Header */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md bg-white/10 border-b border-white/10 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center border-2 border-yellow-200">
            <span className="text-amber-900 font-black text-xl italic">P</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-blue-600 group-hover:text-amber-500 transition-colors">DASHBOARD</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-2.5 rounded-2xl font-bold text-sm text-gray-600 hover:text-blue-500 hover:bg-white/50 transition-all"
          >
            Entrar
          </button>
          <button 
            onClick={() => router.push('/register')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Registrarse
          </button>
        </div>
      </nav>

      {/* Hero Section - Full Screen Bleed */}
      <main className="flex-grow flex items-center px-12 md:px-24">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 items-center gap-12">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100/50 border border-yellow-200 rounded-full text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Prueba Técnica - Edición Premium 2026
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-gray-900">
              Tu Pokédex <br/>
              <span className="text-blue-600 italic">Evolucionada</span>.
            </h1>
            
            <p className="max-w-md text-lg md:text-xl text-gray-500 font-medium leading-relaxed font-manrope">
              Una plataforma segura, modular e inmersiva para investigadores de alto nivel. Gestión de datos en tiempo real con blindaje OWASP.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <button 
                onClick={() => router.push('/register')}
                className="group relative px-8 py-5 bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-black text-lg rounded-[2rem] shadow-[0_20px_50px_rgba(251,191,36,0.3)] hover:shadow-[0_25px_60px_rgba(251,191,36,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Deseo mi ID <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-6 px-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 border-2 border-white rounded-full bg-gray-100 overflow-hidden ring-4 ring-blue-500/5">
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i * 25}.png`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900">+5000</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registrados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Space Reserved for Mascot in Video */}
          <div className="hidden md:block" />
        </div>
      </main>

      {/* Footer Info / Trust Badges */}
      <footer className="px-12 py-10 animate-fade-in delay-500">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-gray-100 pt-10">
          <div className="flex gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="flex items-center gap-2"><ShieldIcon size={18} /> <span className="text-[10px] font-bold uppercase tracking-widest">OWASP Top 10</span></div>
            <div className="flex items-center gap-2"><ActivityIcon size={18} /> <span className="text-[10px] font-bold uppercase tracking-widest">Modular Arc</span></div>
            <div className="flex items-center gap-2"><GlobeIcon size={18} /> <span className="text-[10px] font-bold uppercase tracking-widest">Global Pokedex</span></div>
          </div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
            © 2026 Advanced Agentic Coding - Deepmind Edition
          </p>
        </div>
      </footer>
    </div>
  );
}
