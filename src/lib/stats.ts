import data from "@/data/pokemon-data.json";
import { getAreaSvgCoord, REGION_LABELS, type MapRegion } from "@/data/area-coordinates";
import { pokemonKey } from "./pokemon-key";
import type { Area, AreaStats, GameVersion, PokemonEntry, RegionStats } from "./types";

export function isAvailableInVersion(p: PokemonEntry, version: GameVersion): boolean {
  return p.version === "both" || p.version === version;
}

export function getRelevantPokemon(version: GameVersion): PokemonEntry[] {
  return data.pokemon.filter(p => isAvailableInVersion(p, version));
}

export function getAreaPokemon(area: Area, version: GameVersion): PokemonEntry[] {
  const names = new Set<string>();
  for (const spawn of area.spawns) {
    for (const poke of spawn.pokemon) {
      names.add(pokemonKey(poke));
    }
  }
  return data.pokemon.filter(p => names.has(pokemonKey(p)) && isAvailableInVersion(p, version));
}

export function computeGlobalStats(caught: Record<string, boolean>, version: GameVersion) {
  const relevant = getRelevantPokemon(version);
  const caughtCount = relevant.filter(p => caught[pokemonKey(p)]).length;
  return {
    total: relevant.length,
    caught: caughtCount,
    percent: relevant.length ? Math.round((caughtCount / relevant.length) * 100) : 0,
  };
}

export function computeAreaStats(
  caught: Record<string, boolean>,
  version: GameVersion,
): AreaStats[] {
  return data.areas.map(area => {
    const pokemon = getAreaPokemon(area, version);
    const caughtCount = pokemon.filter(p => caught[pokemonKey(p)]).length;
    const coord = getAreaSvgCoord(area.name);
    return {
      area,
      total: pokemon.length,
      caught: caughtCount,
      percent: pokemon.length ? Math.round((caughtCount / pokemon.length) * 100) : 0,
      coord,
    };
  });
}

export function computeRegionStats(
  caught: Record<string, boolean>,
  version: GameVersion,
): RegionStats[] {
  const areaStats = computeAreaStats(caught, version);
  const byRegion = new Map<MapRegion, AreaStats[]>();

  for (const stat of areaStats) {
    const region = stat.coord.region as MapRegion;
    if (!byRegion.has(region)) byRegion.set(region, []);
    byRegion.get(region)!.push(stat);
  }

  const regions: MapRegion[] = ["starter", "wild-area", "mid-game", "late-game", "special"];
  return regions
    .filter(r => byRegion.has(r))
    .map(region => {
      const areas = byRegion.get(region)!;
      const total = areas.reduce((s, a) => s + a.total, 0);
      const caughtCount = areas.reduce((s, a) => s + a.caught, 0);
      return {
        region,
        label: REGION_LABELS[region],
        total,
        caught: caughtCount,
        percent: total ? Math.round((caughtCount / total) * 100) : 0,
        areas,
      };
    });
}

export function findPokemonLocations(pokemonName: string, galarian: boolean) {
  const key = `${pokemonName}${galarian ? "-galar" : ""}`;
  const entry = data.pokemon.find(p => pokemonKey(p) === key);
  return entry?.locations ?? [];
}

export { data as pokemonData };
