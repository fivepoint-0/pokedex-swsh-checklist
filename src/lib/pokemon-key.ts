import type { PokemonEntry } from "./types";

export function pokemonKey(p: Pick<PokemonEntry, "name" | "galarian">): string {
  return `${p.name}${p.galarian ? "-galar" : ""}`;
}
