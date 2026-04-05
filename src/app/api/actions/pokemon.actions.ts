'use server';

export interface PokemonData {
  name: string;
  id: number;
  height: number;
  weight: number;
  image: string;
  type: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
  };
}

export async function fetchRandomPokemon(): Promise<{ success: boolean; data?: PokemonData; error?: string }> {
  try {
    // Generar un ID aleatorio entre 1 y 151 (Kanto)
    const randomId = Math.floor(Math.random() * 151) + 1;
    
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`, {
      // Force cache o revalidate para optimizar en Next.js
      next: { revalidate: 0 } // Desactivamos caché para que siempre sea random
    });

    if (!res.ok) {
      throw new Error('Fallo al contactar PokéAPI');
    }

    const data = await res.json();
    
    const pokemon: PokemonData = {
      name: data.name,
      id: data.id,
      height: data.height,
      weight: data.weight,
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      type: data.types[0].type.name,
      stats: {
        hp: data.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
        attack: data.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0,
        defense: data.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0,
      }
    };

    return { success: true, data: pokemon };
  } catch (error) {
    console.error('PokeAPI Error:', error);
    return { success: false, error: 'No se pudo desencriptar la información del espécimen.' };
  }
}
