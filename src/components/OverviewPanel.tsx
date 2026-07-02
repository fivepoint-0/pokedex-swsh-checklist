import { ChevronRight } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { REGION_COLORS } from "@/data/area-coordinates";
import { computeRegionStats } from "@/lib/stats";
import type { GameVersion } from "@/lib/types";

interface OverviewPanelProps {
  caught: Record<string, boolean>;
  gameVersion: GameVersion;
  onSelectArea: (areaId: string) => void;
}

export function OverviewPanel({ caught, gameVersion, onSelectArea }: OverviewPanelProps) {
  const regions = computeRegionStats(caught, gameVersion);
  const completeAreas = regions.flatMap(r => r.areas).filter(a => a.percent === 100 && a.total > 0);
  const incompleteAreas = regions
    .flatMap(r => r.areas)
    .filter(a => a.percent < 100 && a.total > 0)
    .sort((a, b) => a.percent - b.percent);

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start space-y-5 lg:space-y-0">
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          By Region
        </h2>
        <div className="space-y-2">
          {regions.map(r => (
            <div
              key={r.region}
              className="rounded-xl border border-white/[0.06] bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-2.5 rounded-full shrink-0 ring-2 ring-white/10"
                    style={{ background: REGION_COLORS[r.region as keyof typeof REGION_COLORS] }}
                  />
                  <span className="text-sm font-medium">{r.label}</span>
                </div>
                <span className="text-xs tabular-nums font-medium text-muted-foreground">
                  {r.caught}
                  <span className="text-muted-foreground/60">/{r.total}</span>
                </span>
              </div>
              <ProgressBar value={r.caught} max={r.total} />
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-5">
        {incompleteAreas.length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Needs Work
            </h2>
            <div className="space-y-1.5 max-h-52 lg:max-h-[420px] overflow-y-auto pr-1">
              {incompleteAreas.slice(0, 15).map(a => (
                <button
                  key={a.area.id}
                  type="button"
                  onClick={() => onSelectArea(a.area.id)}
                  className="group w-full flex items-center gap-3 rounded-xl border border-white/[0.04] bg-secondary/20 px-3 py-2.5 text-left hover:bg-secondary/50 hover:border-white/[0.08] transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate group-hover:text-foreground transition-colors">
                      {a.area.name}
                    </p>
                    <div className="mt-1.5">
                      <ProgressBar value={a.caught} max={a.total} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-xs tabular-nums text-muted-foreground">
                    <span>{a.caught}/{a.total}</span>
                    <ChevronRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {completeAreas.length > 0 && (
          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 mb-2">
              ✓ {completeAreas.length} Complete {completeAreas.length === 1 ? "Area" : "Areas"}
            </h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {completeAreas.slice(0, 10).map(a => a.area.name).join(" · ")}
              {completeAreas.length > 10 && ` · +${completeAreas.length - 10} more`}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
