import { Check, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ProgressBar";
import { pokemonKey } from "@/lib/pokemon-key";
import { getRelevantPokemon } from "@/lib/stats";
import type { GameVersion, PokemonEntry, PokemonFilter } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PokemonPanelProps {
  caught: Record<string, boolean>;
  gameVersion: GameVersion;
  onToggle: (key: string) => void;
  onSelectPokemon: (pokemon: PokemonEntry) => void;
  selectedKey: string | null;
}

export function PokemonPanel({
  caught,
  gameVersion,
  onToggle,
  onSelectPokemon,
  selectedKey,
}: PokemonPanelProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PokemonFilter>("all");

  const pokemon = useMemo(() => {
    let list = getRelevantPokemon(gameVersion);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(p => p.displayName.toLowerCase().includes(q));
    if (filter === "caught") list = list.filter(p => caught[pokemonKey(p)]);
    if (filter === "missing") list = list.filter(p => !caught[pokemonKey(p)]);
    return list;
  }, [caught, gameVersion, search, filter]);

  const total = getRelevantPokemon(gameVersion).length;
  const caughtCount = getRelevantPokemon(gameVersion).filter(p => caught[pokemonKey(p)]).length;

  return (
    <div className="space-y-2 flex flex-col min-h-0">
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search Pokémon…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <div className="flex gap-1">
        {(["all", "missing", "caught"] as const).map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 rounded-md py-1 text-[11px] font-medium capitalize transition-colors",
              filter === f ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ProgressBar value={caughtCount} max={total} showLabel />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-0.5 flex-1 overflow-y-auto -mx-1 px-1 max-h-[calc(100vh-320px)] lg:max-h-[calc(100vh-340px)] min-h-[200px]">
        {pokemon.map(p => {
          const key = pokemonKey(p);
          const isCaught = !!caught[key];
          const isSelected = selectedKey === key;
          return (
            <div
              key={key}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors group",
                isSelected ? "bg-muted" : "hover:bg-muted/50",
              )}
            >
              <button
                type="button"
                onClick={() => onToggle(key)}
                className={cn(
                  "size-5 shrink-0 rounded border flex items-center justify-center transition-all",
                  isCaught
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "border-border/80 hover:border-emerald-500/50",
                )}
              >
                {isCaught && <Check className="size-3" strokeWidth={3} />}
              </button>
              <button
                type="button"
                onClick={() => onSelectPokemon(p)}
                className="flex-1 flex items-center gap-1.5 min-w-0 text-left"
              >
                <span className={cn("text-xs truncate", isCaught && "text-muted-foreground line-through")}>
                  {p.displayName}
                </span>
                {p.version !== "both" && (
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase px-1 rounded shrink-0",
                      p.version === "sword" ? "text-blue-400 bg-blue-500/10" : "text-red-400 bg-red-500/10",
                    )}
                  >
                    {p.version[0]}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => onSelectPokemon(p)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-foreground transition-opacity"
                title="Show on map"
              >
                <MapPin className="size-3" />
              </button>
            </div>
          );
        })}
        {pokemon.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">No Pokémon match your filters.</p>
        )}
      </div>
    </div>
  );
}
