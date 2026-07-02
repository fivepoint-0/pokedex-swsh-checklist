import { X } from "lucide-react";
import { pokemonKey } from "@/lib/pokemon-key";
import { getAreaPokemon } from "@/lib/stats";
import type { Area, GameVersion } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AreaDetailProps {
  area: Area;
  caught: Record<string, boolean>;
  gameVersion: GameVersion;
  onToggle: (key: string) => void;
  onClose: () => void;
}

export function AreaDetail({ area, caught, gameVersion, onToggle, onClose }: AreaDetailProps) {
  const pokemon = getAreaPokemon(area, gameVersion);
  const relevantKeys = new Set(pokemon.map(p => pokemonKey(p)));
  const caughtCount = pokemon.filter(p => caught[pokemonKey(p)]).length;

  return (
    <div className="rounded-lg border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-start justify-between gap-2 px-3 py-2 border-b border-border/40">
        <div>
          <h3 className="text-sm font-semibold leading-tight">{area.name}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {caughtCount}/{pokemon.length} caught · {area.spawns.length} spawn tables
          </p>
        </div>
        <button type="button" onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="size-3.5" />
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {area.spawns.map((spawn, i) => (
          <div key={i} className="px-3 py-2 border-b border-border/20 last:border-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {spawn.spawnType === "overworld" ? "👁 Overworld" : "🌿 Hidden"} · {spawn.weather} ·{" "}
              {spawn.levelRange}
            </p>
            <div className="flex flex-wrap gap-1">
              {spawn.pokemon.map(poke => {
                const key = pokemonKey(poke);
                if (!relevantKeys.has(key)) return null;
                const isCaught = !!caught[key];
                return (
                  <button
                    key={`${key}-${spawn.weather}-${i}`}
                    type="button"
                    onClick={() => onToggle(key)}
                    className={cn(
                      "text-[11px] px-1.5 py-0.5 rounded-md border transition-colors",
                      isCaught
                        ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300 line-through"
                        : "border-border/50 hover:border-emerald-500/40",
                    )}
                  >
                    {poke.displayName} {poke.rate}%
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
