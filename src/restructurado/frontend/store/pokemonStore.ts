import { create } from 'zustand';

export type RegionKey = 'kanto' | 'johto' | 'hoenn' | 'sinnoh' | 'unova' | 'kalos' | 'alola' | 'galar' | 'paldea';

export interface RegionData {
  name: string;
  min: number;
  max: number;
}

export const REGIONS: Record<RegionKey, RegionData> = {
  kanto: { name: 'Kanto', min: 1, max: 151 },
  johto: { name: 'Johto', min: 152, max: 251 },
  hoenn: { name: 'Hoenn', min: 252, max: 386 },
  sinnoh: { name: 'Sinnoh', min: 387, max: 493 },
  unova: { name: 'Unova', min: 494, max: 649 },
  kalos: { name: 'Kalos', min: 650, max: 721 },
  alola: { name: 'Alola', min: 722, max: 809 },
  galar: { name: 'Galar', min: 810, max: 898 },
  paldea: { name: 'Paldea', min: 900, max: 1025 },
};

interface PokemonState {
  selectedRegion: RegionKey;
  setRegion: (region: RegionKey) => void;
  getRegionRange: () => { min: number; max: number };
}

export const usePokemonStore = create<PokemonState>((set, get) => ({
  selectedRegion: 'kanto',
  setRegion: (region: RegionKey) => set({ selectedRegion: region }),
  getRegionRange: () => {
    const region = get().selectedRegion;
    return { min: REGIONS[region].min, max: REGIONS[region].max };
  },
}));
