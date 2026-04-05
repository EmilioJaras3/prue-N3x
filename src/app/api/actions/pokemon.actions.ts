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

// Implementación de distancia de Levenshtein
function levenshteinDistance(s1: string, s2: string): number {
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;
  
  const matrix: number[][] = [];
  for (let i = 0; i <= s1.length; i++) { matrix[i] = [i]; }
  for (let j = 0; j <= s2.length; j++) { matrix[0][j] = j; }
  
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[s1.length][s2.length];
}

let cachedPokemonList: string[] | null = null;

export async function searchPokemonByName(name: string): Promise<{ success: boolean; data?: PokemonData; error?: string }> {
  try {
    let cleanName = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cleanName) {
      return { success: false, error: 'Ingresa un nombre válido.' };
    }

    // Cargar la lista si no está en memoria
    if (!cachedPokemonList) {
      try {
        const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000', { next: { revalidate: 3600 } });
        if (listRes.ok) {
          const listData = await listRes.json();
          cachedPokemonList = listData.results.map((p: any) => p.name);
        }
      } catch (e) {
        // Fallará silenciosamente y continuará
      }
    }

    // Si tenemos la lista, intentamos encontrar el más parecido
    if (cachedPokemonList) {
      let bestMatch = cleanName;
      let minDistance = Infinity;

      for (const pName of cachedPokemonList) {
        if (pName === cleanName) {
          bestMatch = pName;
          minDistance = 0;
          break;
        }
        // Verificamos substrings directos o calculamos distancia
        if (pName.includes(cleanName) && pName.length - cleanName.length <= 2) {
          bestMatch = pName;
          minDistance = 1; // Priorizar substrings si son parecidos
        } else {
          const dist = levenshteinDistance(cleanName, pName);
          if (dist < minDistance) {
            minDistance = dist;
            bestMatch = pName;
          }
        }
      }

      // Si la diferencia es de 1 a 3 caracteres, lo aceptamos
      if (minDistance > 0 && minDistance <= 3 && Math.abs(cleanName.length - bestMatch.length) <= 2) {
         cleanName = bestMatch;
      }
    }

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`, {
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      return { success: false, error: `No se encontró "${name}" en la Pokédex.` };
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
    console.error('PokeAPI Search Error:', error);
    return { success: false, error: 'Error de conexión con PokéAPI.' };
  }
}

import { db } from '@/lib/db';
import { pokemon_collection, action_logs } from '@/services/postgres/schema';
import { getCurrentUser } from './auth.actions';
import { desc, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function savePokemonToBox(pokemon: PokemonData): Promise<{ success: boolean; error?: string }> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.data) {
      return { success: false, error: 'No autorizado' };
    }

    const userId = userResult.data.id;

    // Verificar límite o si ya lo tiene (opcional, por ahora lo dejamos guardar repetidos)
    await db.insert(pokemon_collection).values({
      user_id: userId,
      pokemon_id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      image_url: pokemon.image,
      weight: pokemon.weight,
      height: pokemon.height,
      stats_json: JSON.stringify(pokemon.stats),
    });

    // Registrar en auditoría
    const reqHeaders = await headers();
    const forwardedFor = reqHeaders.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    
    await db.insert(action_logs).values({
      user_id: userId,
      action_type: 'VAULT_SECRET',
      action_details: `Capturó a ${pokemon.name.toUpperCase()}`,
      ip_address: ip,
      user_agent: reqHeaders.get('user-agent') || 'Internal System',
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving Pokemon:', error);
    return { success: false, error: 'Error de base de datos' };
  }
}

export async function getBoxPokemon(): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success || !userResult.data) {
      return { success: false, error: 'No autorizado' };
    }

    const caught = await db
      .select()
      .from(pokemon_collection)
      .where(eq(pokemon_collection.user_id, userResult.data.id))
      .orderBy(desc(pokemon_collection.captured_at));

    return { success: true, data: caught };
  } catch (error) {
    console.error('Error getting Box:', error);
    return { success: false, error: 'No se pudo cargar la Caja PC' };
  }
}
