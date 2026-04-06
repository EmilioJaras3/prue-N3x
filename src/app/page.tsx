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
          <span className="text-2xl font-black tracking-tighter text-blue-600 group-hover:text-amber-500 transition-colors uppercase">Registra tus Pokémon</span>
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
      <main className="flex-grow flex items-center px-12 md:px-24 pt-32 pb-20">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 items-center gap-12">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in text-center md:text-left z-10">
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-gray-900">
              Registra a todos <br/>
              <span className="text-blue-600 italic">tus Pokémon</span>.
            </h1>
            
            <p className="max-w-md text-base md:text-lg text-gray-600 font-semibold leading-relaxed font-manrope">
              Sé el mejor maestro Pokémon y registra a todos los que puedas. 
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
      <footer className="w-full py-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
            © 2026 Luis Emilio Jaras Sanchez
          </p>
        </div>
      </footer>
    </div>
  );
}
