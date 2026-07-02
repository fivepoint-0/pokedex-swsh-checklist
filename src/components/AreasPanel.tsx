import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ProgressBar";
import { REGION_COLORS } from "@/data/area-coordinates";
import { computeAreaStats } from "@/lib/stats";
import type { GameVersion } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AreasPanelProps {
  caught: Record<string, boolean>;
  gameVersion: GameVersion;
  selectedAreaId: string | null;
  onSelectArea: (areaId: string) => void;
}

export function AreasPanel({ caught, gameVersion, selectedAreaId, onSelectArea }: AreasPanelProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "progress">("progress");

  const areas = useMemo(() => {
    let list = computeAreaStats(caught, gameVersion).filter(a => a.total > 0);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(a => a.area.name.toLowerCase().includes(q));
    if (sortBy === "name") list.sort((a, b) => a.area.name.localeCompare(b.area.name));
    else list.sort((a, b) => a.percent - b.percent || a.area.name.localeCompare(b.area.name));
    return list;
  }, [caught, gameVersion, search, sortBy]);

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        <Input
          placeholder="Filter areas…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-8 text-xs flex-1"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as "name" | "progress")}
          className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
        >
          <option value="progress">By progress</option>
          <option value="name">By name</option>
        </select>
      </div>

      <div className="space-y-1 max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-320px)] overflow-y-auto -mx-1 px-1">
        {areas.map(a => (
          <button
            key={a.area.id}
            type="button"
            onClick={() => onSelectArea(a.area.id)}
            className={cn(
              "w-full rounded-lg border p-2 text-left transition-all",
              selectedAreaId === a.area.id
                ? "border-primary/50 bg-muted/50"
                : "border-border/40 hover:border-border/80 hover:bg-muted/30",
              a.percent === 100 && "border-emerald-500/30",
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="size-2 rounded-full shrink-0"
                style={{ background: REGION_COLORS[a.coord.region as keyof typeof REGION_COLORS] }}
              />
              <span className="text-xs font-medium flex-1 truncate">{a.area.name}</span>
              <span
                className={cn(
                  "text-[10px] tabular-nums font-semibold",
                  a.percent === 100 ? "text-emerald-400" : "text-muted-foreground",
                )}
              >
                {a.caught}/{a.total}
              </span>
              <ChevronRight className="size-3 text-muted-foreground shrink-0" />
            </div>
            <ProgressBar value={a.caught} max={a.total} />
          </button>
        ))}
      </div>
    </div>
  );
}
