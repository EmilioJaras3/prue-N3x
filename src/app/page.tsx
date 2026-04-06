import Link from 'next/link';
import { DatabaseIcon } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-transparent text-white flex flex-col items-center justify-center relative overflow-hidden font-inter selection:bg-red-500/30">
      
      {/* Background Ambience sutil (para no tapar el video glboal) */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-600/10 blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Column - Hero Text */}
        <div className="flex flex-col items-start text-left space-y-8">
          
          <h1 className="text-5xl md:text-7xl font-black font-manrope tracking-tighter leading-[1.1]">
            <span className="text-white">Explora.</span><br />
            <span className="text-neutral-500">Clasifica.</span><br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-400">
              Colecciona.
            </span>
          </h1>
          
          <p className="text-lg text-neutral-300 font-inter max-w-lg leading-relaxed">
            Tu propio Sistema de Almacenamiento Pokémon. Inicia sesión en tu PC para consultar la Pokédex Nacional, transferir nuevas especies capturadas y organizar a todo tu equipo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-red-500 font-space text-sm"
            >
              Nuevo Entrenador
            </Link>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-black/40 hover:bg-black/60 text-white font-bold tracking-widest uppercase border border-white/20 hover:border-red-500/30 backdrop-blur-md rounded-xl transition-all duration-300 font-space text-sm"
            >
              Accesar PC
            </Link>
          </div>

        </div>

        {/* Right Column - CSS Pokeball Premium */}
        <div className="relative w-full max-w-lg mx-auto lg:ml-auto flex items-center justify-center">
            
            <div className="relative group">
              {/* Resplandor trasero animado */}
               <div className="absolute -inset-10 bg-red-500/20 rounded-full blur-3xl -z-10 animate-pulse group-hover:bg-red-500/30 transition-colors duration-500" />
               <div className="absolute -inset-20 border border-red-500/10 rounded-full -z-10 animate-[spin_10s_linear_infinite]" />
               
               {/* Pokebola 100% CSS */}
               <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border-8 border-white/90 flex items-center justify-center bg-black/40 backdrop-blur-xl shadow-[0_0_60px_rgba(255,0,0,0.4)] relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                  {/* Mitad superior (Roja Holográfica) */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-500/60 to-red-600/40" />
                  
                  {/* Mitad inferior (Cristal) */}
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/10 to-transparent" />
                  
                  {/* Línea divisoria */}
                  <div className="absolute top-1/2 left-0 w-full h-[6px] bg-white/90 -translate-y-1/2 z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  
                  {/* Botón central (Anillo exterior) */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 md:border-[6px] border-white/90 bg-black/60 relative z-20 shadow-[0_0_20px_rgba(0,0,0,0.8)] inset-shadow flex items-center justify-center backdrop-blur-md">
                     {/* Botón central (Pulsador interior) */}
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 border border-white/50 group-hover:bg-red-400 group-hover:shadow-[0_0_25px_rgba(255,0,0,1)] transition-all duration-300" />
                  </div>
               </div>

               {/* Stats de Búsqueda Biológica */}
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/50 border border-white/10 text-white/70 text-[10px] font-mono tracking-[0.2em] px-4 py-2 rounded-full backdrop-blur-md uppercase flex items-center gap-2">
                 <DatabaseIcon size={12} className="text-red-400 animate-pulse" />
                 Conectado a la Red Kanto...
               </div>
            </div>

        </div>

      </div>

    </div>
  );
}
