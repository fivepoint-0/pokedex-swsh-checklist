import { Map, MapPin, LayoutGrid, List } from "lucide-react";
import type { Tab } from "@/lib/types";
import { cn } from "@/lib/utils";

const TABS: { id: Tab; label: string; icon: typeof List }[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "pokemon", label: "Pokédex", icon: List },
  { id: "areas", label: "Areas", icon: MapPin },
  { id: "map", label: "Map", icon: Map },
];

interface TabNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-muted/60 border border-white/[0.06]">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 rounded-lg py-2 px-1 text-[10px] font-medium transition-all",
            active === id
              ? "bg-card text-foreground shadow-md shadow-black/20 border border-white/[0.08]"
              : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
          )}
        >
          <Icon className={cn("size-4", active === id && "text-primary")} strokeWidth={active === id ? 2.5 : 2} />
          {label}
        </button>
      ))}
    </nav>
  );
}
