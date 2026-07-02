import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { GalarMapSvg } from "@/components/GalarMapSvg";
import { REGION_COLORS, REGION_LABELS } from "@/data/area-coordinates";
import { computeAreaStats } from "@/lib/stats";
import type { GameVersion, PokemonEntry } from "@/lib/types";

interface MapPanelProps {
  caught: Record<string, boolean>;
  gameVersion: GameVersion;
  selectedAreaId: string | null;
  highlightPokemon: PokemonEntry | null;
  onSelectArea: (areaId: string) => void;
  onClearHighlight?: () => void;
}

export function MapPanel({
  caught,
  gameVersion,
  selectedAreaId,
  highlightPokemon,
  onSelectArea,
  onClearHighlight,
}: MapPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const areaStats = useMemo(
    () => computeAreaStats(caught, gameVersion).filter(a => a.total > 0),
    [caught, gameVersion],
  );

  const highlightAreaIds = useMemo(() => {
    if (!highlightPokemon) return new Set<string>();
    return new Set(highlightPokemon.locations.map(l => l.areaId));
  }, [highlightPokemon]);

  const tooltipArea = hoveredId
    ? areaStats.find(a => a.area.id === hoveredId)
    : selectedAreaId
      ? areaStats.find(a => a.area.id === selectedAreaId)
      : null;

  return (
    <div className="space-y-2">
      {highlightPokemon && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Showing locations for{" "}
            <span className="text-foreground font-medium">{highlightPokemon.displayName}</span> (
            {highlightAreaIds.size} areas)
          </p>
          {onClearHighlight && (
            <button
              type="button"
              onClick={onClearHighlight}
              className="text-muted-foreground hover:text-foreground p-0.5"
              title="Clear highlight"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-[10px]">
        {Object.entries(REGION_LABELS).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1">
            <span
              className="size-2 rounded-full"
              style={{ background: REGION_COLORS[key as keyof typeof REGION_COLORS] }}
            />
            {label}
          </span>
        ))}
      </div>

      <div className="relative rounded-lg overflow-hidden border border-border/50 bg-[#1a2634]">
        <div className="max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-320px)] overflow-y-auto">
          <GalarMapSvg
            areas={areaStats}
            selectedAreaId={selectedAreaId}
            hoveredId={hoveredId}
            highlightAreaIds={highlightAreaIds}
            dimUnhighlighted={!!highlightPokemon}
            onSelectArea={onSelectArea}
            onHoverArea={setHoveredId}
          />
        </div>

        {tooltipArea && (
          <div className="absolute bottom-2 inset-x-2 z-10 pointer-events-none">
            <div className="rounded-md border border-white/10 bg-card/95 backdrop-blur-sm px-3 py-1.5 text-xs shadow-lg">
              <span className="font-semibold">{tooltipArea.area.name}</span>
              <span className="text-muted-foreground ml-2">
                {tooltipArea.caught}/{tooltipArea.total} · {tooltipArea.percent}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
