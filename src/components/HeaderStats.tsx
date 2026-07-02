import { Download, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { computeGlobalStats } from "@/lib/stats";
import type { GameVersion } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeaderStatsProps {
  caught: Record<string, boolean>;
  gameVersion: GameVersion;
  onVersionChange: (v: GameVersion) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: () => void;
}

export function HeaderStats({
  caught,
  gameVersion,
  onVersionChange,
  onReset,
  onExport,
  onImport,
}: HeaderStatsProps) {
  const stats = computeGlobalStats(caught, gameVersion);

  return (
    <header className="space-y-4 lg:flex lg:items-center lg:gap-8 lg:space-y-0">
      <div className="flex items-start justify-between gap-3 lg:flex-col lg:shrink-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
              Galar
            </span>{" "}
            <span className="text-foreground">Pokédex</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-1">Sword &amp; Shield completion tracker</p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 lg:mt-2">
          <Button variant="ghost" size="icon-sm" onClick={onImport} title="Import progress">
            <Upload className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onExport} title="Export progress">
            <Download className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onReset} title="Reset progress">
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 lg:p-4 rounded-xl bg-secondary/50 border border-white/[0.06] flex-1 min-w-0">
        <div className="relative size-16 lg:size-[4.5rem] shrink-0">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/80" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${stats.percent} 100`}
              pathLength={100}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold tabular-nums">{stats.percent}%</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground font-medium">Overall progress</span>
            <span className="text-sm font-semibold tabular-nums">
              {stats.caught}
              <span className="text-muted-foreground font-normal"> / {stats.total}</span>
            </span>
          </div>
          <ProgressBar value={stats.caught} max={stats.total} size="md" />

          <div className="flex gap-1.5 pt-0.5 max-w-xs lg:max-w-sm">
            {(["sword", "shield"] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => onVersionChange(v)}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all border",
                  gameVersion === v
                    ? v === "sword"
                      ? "bg-blue-500/15 border-blue-500/40 text-blue-400 shadow-sm shadow-blue-500/10"
                      : "bg-red-500/15 border-red-500/40 text-red-400 shadow-sm shadow-red-500/10"
                    : "border-transparent bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
