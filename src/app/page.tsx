import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4 py-10">
      <div className="mb-8 animate-fade-in relative">
        <div className="w-20 h-20 rounded-full border-4 border-red-500/50 flex items-center justify-center bg-black/60 backdrop-blur-xl shadow-[0_0_40px_rgba(255,0,0,0.3)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500/20" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white/5" />
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-red-500/60 -translate-y-1/2 z-10" />
          <div className="w-6 h-6 rounded-full border-2 border-red-500/70 bg-black/80 relative z-20 shadow-[0_0_15px_rgba(255,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.8)] transition-all" />
        </div>
        <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
      </div>

      <h1 className="text-5xl md:text-7xl font-bold font-space mb-6 leading-tight tracking-tighter">
        <span className="bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent">Caja</span>
        <br />
        <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">Pokémon</span>
      </h1>

      <p className="text-base md:text-lg text-white/60 max-w-xl mb-12 leading-relaxed font-manrope">
        ¡Guarda todos los Pokémon que atrapes en tu propia caja digital!
        Busca, escanea y colecciona especies de todas las regiones.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-20">
        <Link 
          href="/login"
          className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(255,0,0,0.3)] hover:shadow-[0_0_40px_rgba(255,0,0,0.5)] hover:scale-105 border border-red-400/30 font-space text-sm"
        >
          ¡Ya Tengo Cuenta!
        </Link>
        <Link 
          href="/register"
          className="px-10 py-4 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white font-bold tracking-widest uppercase rounded-xl border border-white/10 hover:border-red-500/30 transition-all duration-300 backdrop-blur-xl font-space text-sm"
        >
          Soy Nuevo Entrenador
        </Link>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 w-full">
        {[
          { type: 'Fuego', color: 'from-orange-600/30 to-red-600/30', border: 'border-orange-500/30' },
          { type: 'Agua', color: 'from-blue-600/30 to-cyan-600/30', border: 'border-blue-500/30' },
          { type: 'Eléctrico', color: 'from-yellow-600/30 to-amber-600/30', border: 'border-yellow-500/30' },
          { type: 'Planta', color: 'from-green-600/30 to-emerald-600/30', border: 'border-green-500/30' },
          { type: 'Psíquico', color: 'from-purple-600/30 to-pink-600/30', border: 'border-purple-500/30' },
          { type: 'Dragón', color: 'from-indigo-600/30 to-violet-600/30', border: 'border-indigo-500/30' },
        ].map((t, i) => (
          <div key={i} className={`p-4 rounded-xl bg-gradient-to-b ${t.color} border ${t.border} backdrop-blur-xl transition-all duration-300 group text-center flex flex-col items-center justify-center gap-2 hover:scale-105 cursor-default h-24`}>
            <h3 className="font-bold text-white text-[10px] font-space tracking-wider uppercase">{t.type}</h3>
          </div>
        ))}
      </div>

      <div className="mt-20 opacity-20 flex items-center gap-6">
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent to-red-500" />
        <div className="w-3 h-3 rounded-full border border-red-500/50" />
        <div className="h-[1px] w-32 bg-gradient-to-l from-transparent to-red-500" />
      </div>
      <p className="mt-4 text-white/15 text-[10px] font-mono tracking-[0.4em] uppercase">Caja Pokémon // Prueba Técnica N3X</p>
    </div>
  );
}
