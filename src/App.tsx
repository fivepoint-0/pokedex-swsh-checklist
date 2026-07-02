import { useCallback, useState } from "react";
import { AreaDetail } from "@/components/AreaDetail";
import { AreasPanel } from "@/components/AreasPanel";
import { HeaderStats } from "@/components/HeaderStats";
import { MapPanel } from "@/components/MapPanel";
import { OverviewPanel } from "@/components/OverviewPanel";
import { PokemonPanel } from "@/components/PokemonPanel";
import { TabNav } from "@/components/TabNav";
import { pokemonData } from "@/lib/stats";
import { pokemonKey } from "@/lib/pokemon-key";
import type { PokemonEntry, Tab } from "@/lib/types";
import { useProgress } from "@/lib/use-progress";

export function App() {
  const progress = useProgress();
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [highlightPokemon, setHighlightPokemon] = useState<PokemonEntry | null>(null);
  const [selectedPokemonKey, setSelectedPokemonKey] = useState<string | null>(null);

  const selectedArea = selectedAreaId
    ? pokemonData.areas.find(a => a.id === selectedAreaId) ?? null
    : null;

  const selectArea = useCallback((areaId: string) => {
    setSelectedAreaId(areaId);
    setTab(prev => (prev === "map" ? "map" : "areas"));
  }, []);

  const selectPokemon = useCallback((pokemon: PokemonEntry) => {
    setHighlightPokemon(pokemon);
    setSelectedPokemonKey(pokemonKey(pokemon));
    setTab("map");
  }, []);

  return (
    <div className="min-h-screen flex justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="w-full max-w-md lg:max-w-5xl xl:max-w-6xl flex flex-col gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />

          <div className="p-4 sm:p-5 lg:p-6 space-y-4">
            <HeaderStats
              caught={progress.caught}
              gameVersion={progress.gameVersion}
              onVersionChange={progress.setGameVersion}
              onReset={progress.resetProgress}
              onExport={progress.exportProgress}
              onImport={progress.importProgress}
            />

            <TabNav active={tab} onChange={setTab} />
          </div>

          <main className="px-4 sm:px-5 lg:px-6 pb-5 lg:pb-6 min-h-[420px] lg:min-h-[480px]">
            {tab === "overview" && (
              <OverviewPanel
                caught={progress.caught}
                gameVersion={progress.gameVersion}
                onSelectArea={selectArea}
              />
            )}

            {tab === "pokemon" && (
              <PokemonPanel
                caught={progress.caught}
                gameVersion={progress.gameVersion}
                onToggle={progress.toggleCaught}
                onSelectPokemon={selectPokemon}
                selectedKey={selectedPokemonKey}
              />
            )}

            {tab === "areas" && (
              <div className="lg:grid lg:grid-cols-2 lg:gap-5 lg:items-start space-y-3 lg:space-y-0">
                <AreasPanel
                  caught={progress.caught}
                  gameVersion={progress.gameVersion}
                  selectedAreaId={selectedAreaId}
                  onSelectArea={setSelectedAreaId}
                />
                {selectedArea ? (
                  <AreaDetail
                    area={selectedArea}
                    caught={progress.caught}
                    gameVersion={progress.gameVersion}
                    onToggle={progress.toggleCaught}
                    onClose={() => setSelectedAreaId(null)}
                  />
                ) : (
                  <div className="hidden lg:flex items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-secondary/20 p-8 text-sm text-muted-foreground">
                    Select an area to view spawn details
                  </div>
                )}
              </div>
            )}

            {tab === "map" && (
              <div className="lg:grid lg:grid-cols-5 lg:gap-5 lg:items-start space-y-3 lg:space-y-0">
                <div className="lg:col-span-3">
                  <MapPanel
                    caught={progress.caught}
                    gameVersion={progress.gameVersion}
                    selectedAreaId={selectedAreaId}
                    highlightPokemon={highlightPokemon}
                    onSelectArea={setSelectedAreaId}
                    onClearHighlight={() => {
                      setHighlightPokemon(null);
                      setSelectedPokemonKey(null);
                    }}
                  />
                </div>
                <div className="lg:col-span-2">
                  {selectedArea ? (
                    <AreaDetail
                      area={selectedArea}
                      caught={progress.caught}
                      gameVersion={progress.gameVersion}
                      onToggle={progress.toggleCaught}
                      onClose={() => setSelectedAreaId(null)}
                    />
                  ) : (
                    <div className="hidden lg:flex items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-secondary/20 p-8 text-sm text-muted-foreground min-h-[200px]">
                      Click a map marker to view area details
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/60">
          Progress saved locally · {progress.gameVersion === "sword" ? "Pokémon Sword" : "Pokémon Shield"}
        </p>
      </div>
    </div>
  );
}

export default App;
