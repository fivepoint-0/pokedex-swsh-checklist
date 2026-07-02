import type pokemonData from "@/data/pokemon-data.json";

export type GameVersion = "sword" | "shield";

export type PokemonEntry = (typeof pokemonData.pokemon)[number];
export type Area = (typeof pokemonData.areas)[number];
export type SpawnGroup = Area["spawns"][number];

export type Tab = "overview" | "pokemon" | "areas" | "map";

export type PokemonFilter = "all" | "caught" | "missing";

export interface ProgressState {
  caught: Record<string, boolean>;
  gameVersion: GameVersion;
}

export interface AreaStats {
  area: Area;
  total: number;
  caught: number;
  percent: number;
  coord: { px: number; py: number; region: string };
}

export interface RegionStats {
  region: string;
  label: string;
  total: number;
  caught: number;
  percent: number;
  areas: AreaStats[];
}
