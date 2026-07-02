import { useCallback, useEffect, useState } from "react";
import type { GameVersion, ProgressState } from "./types";

const STORAGE_KEY = "swsh-pokedex-progress";

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProgressState;
  } catch {
    /* ignore */
  }
  return { caught: {}, gameVersion: "sword" };
}

function saveState(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const toggleCaught = useCallback((key: string) => {
    setState(prev => ({
      ...prev,
      caught: { ...prev.caught, [key]: !prev.caught[key] },
    }));
  }, []);

  const setCaught = useCallback((key: string, value: boolean) => {
    setState(prev => ({
      ...prev,
      caught: { ...prev.caught, [key]: value },
    }));
  }, []);

  const setGameVersion = useCallback((gameVersion: GameVersion) => {
    setState(prev => ({ ...prev, gameVersion }));
  }, []);

  const isCaught = useCallback(
    (key: string) => !!state.caught[key],
    [state.caught],
  );

  const resetProgress = useCallback(() => {
    if (confirm("Reset all caught Pokémon? This cannot be undone.")) {
      setState(prev => ({ ...prev, caught: {} }));
    }
  }, []);

  const exportProgress = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swsh-pokedex-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importProgress = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const imported = JSON.parse(await file.text()) as ProgressState;
        if (imported.caught && imported.gameVersion) {
          setState(imported);
        }
      } catch {
        alert("Invalid progress file.");
      }
    };
    input.click();
  }, []);

  return {
    caught: state.caught,
    gameVersion: state.gameVersion,
    toggleCaught,
    setCaught,
    setGameVersion,
    isCaught,
    resetProgress,
    exportProgress,
    importProgress,
  };
}
