/** SVG map coordinate space — matches galarMap.svg (433.4 × 595.71). */

export const MAP_WIDTH = 433.4;
export const MAP_HEIGHT = 595.71;

export type MapRegion = "starter" | "wild-area" | "mid-game" | "late-game" | "special";

export interface SvgCoord {
  px: number;
  py: number;
  region: MapRegion;
}

/**
 * Positions in galarMap.svg user space.
 * Anchored to SVG elements: town markers (postwick, wedgehurst, …),
 * red route circles, purple raid dens, and wild-area terrain paths.
 */
const COORDS: Record<string, SvgCoord> = {
  // Early routes — red circles + town markers
  "Route 1": { px: 119, py: 558, region: "starter" },
  "Route 2": { px: 125, py: 530, region: "starter" },
  "Route 2 (High Level)": { px: 95, py: 540, region: "starter" },
  "Route 2 (Surfing)": { px: 155, py: 535, region: "starter" },
  "Slumbering Weald (Low Level)": { px: 69, py: 567, region: "special" },
  "Slumbering Weald (High Level)": { px: 80, py: 580, region: "special" },
  "Route 3": { px: 122, py: 510, region: "starter" },
  "Route 3 (Garbage)": { px: 130, py: 505, region: "starter" },

  // Wild Area south — terrain paths (rolling fields, lakes, groves)
  "Rolling Fields": { px: 107, py: 510, region: "wild-area" },
  "Rolling Fields (2)": { px: 97, py: 516, region: "wild-area" },
  "Rolling Fields (Flying)": { px: 110, py: 505, region: "wild-area" },
  "Rolling Fields (Ground)": { px: 100, py: 515, region: "wild-area" },
  "Dappled Grove": { px: 30, py: 532, region: "wild-area" },
  "Watchtower Ruins": { px: 18, py: 518, region: "wild-area" },
  "Watchtower Ruins (Flying)": { px: 18, py: 518, region: "wild-area" },
  "Giant's Seat": { px: 136, py: 422, region: "wild-area" },
  "South Lake Miloch": { px: 143, py: 492, region: "wild-area" },
  "South Lake Miloch (2)": { px: 158, py: 491, region: "wild-area" },
  "South Lake Miloch (Flying)": { px: 150, py: 488, region: "wild-area" },
  "South Lake Miloch (Surfing)": { px: 155, py: 485, region: "wild-area" },
  "Axew's Eye": { px: 64, py: 430, region: "wild-area" },
  "West Lake Axewell": { px: 79, py: 476, region: "wild-area" },
  "West Lake Axewell (Surfing)": { px: 75, py: 470, region: "wild-area" },
  "North Lake Miloch": { px: 70, py: 425, region: "wild-area" },
  "North Lake Miloch (Surfing)": { px: 68, py: 420, region: "wild-area" },
  "East Lake Axewell": { px: 120, py: 458, region: "wild-area" },
  "East Lake Axewell (Flying)": { px: 120, py: 458, region: "wild-area" },
  "East Lake Axewell (Surfing)": { px: 125, py: 453, region: "wild-area" },

  // Wild Area mid — motostoke riverbank through stony wilderness
  "Motostoke Riverbank": { px: 155, py: 410, region: "wild-area" },
  "Motostoke Riverbank (Surfing)": { px: 160, py: 405, region: "wild-area" },
  "Bridge Field": { px: 115, py: 375, region: "wild-area" },
  "Bridge Field (Surfing)": { px: 118, py: 370, region: "wild-area" },
  "Bridge Field (Flying)": { px: 115, py: 375, region: "wild-area" },
  "Stony Wilderness": { px: 127, py: 358, region: "wild-area" },
  "Stony Wilderness (2)": { px: 120, py: 355, region: "wild-area" },
  "Stony Wilderness (3)": { px: 132, py: 362, region: "wild-area" },
  "Stony Wilderness (Flying)": { px: 127, py: 358, region: "wild-area" },
  "Dusty Bowl": { px: 34, py: 346, region: "wild-area" },
  "Dusty Bowl (Flying)": { px: 34, py: 346, region: "wild-area" },
  "Dusty Bowl and Giant's Mirror (Surfing)": { px: 30, py: 335, region: "wild-area" },
  "Giant's Mirror": { px: 40, py: 320, region: "wild-area" },
  "Giant's Mirror (Flying)": { px: 40, py: 320, region: "wild-area" },
  "Giant's Mirror (Ground)": { px: 43, py: 315, region: "wild-area" },

  // Wild Area north — hammerlocke hills through lake of outrage
  "Hammerlocke Hills": { px: 95, py: 305, region: "wild-area" },
  "Hammerlocke Hills (Flying)": { px: 95, py: 305, region: "wild-area" },
  "Giant's Cap": { px: 108, py: 245, region: "wild-area" },
  "Giant's Cap (2)": { px: 115, py: 240, region: "wild-area" },
  "Giant's Cap (3)": { px: 100, py: 250, region: "wild-area" },
  "Giant's Cap (Ground)": { px: 108, py: 245, region: "wild-area" },
  "Lake of Outrage": { px: 35, py: 285, region: "wild-area" },
  "Lake of Outrage (Surfing)": { px: 38, py: 280, region: "wild-area" },

  // Mid-game routes — red circles + path markers
  "Galar Mine": { px: 146, py: 508, region: "mid-game" },
  "Galar Mine No. 2": { px: 125, py: 365, region: "mid-game" },
  "Route 4": { px: 52, py: 368, region: "mid-game" },
  "Route 5": { px: 86, py: 340, region: "mid-game" },
  "Motostoke Outskirts": { px: 170, py: 366, region: "mid-game" },
  "Route 6": { px: 66, py: 280, region: "mid-game" },
  "Glimwood Tangle": { px: 175, py: 265, region: "mid-game" },
  "Route 7": { px: 153, py: 291, region: "mid-game" },

  // Late-game routes — northern red circles
  "Route 8": { px: 161, py: 258, region: "late-game" },
  "Route 8 (on Steamdrift Way)": { px: 199, py: 265, region: "late-game" },
  "Route 9": { px: 185, py: 235, region: "late-game" },
  "Route 9 (in Circhester Bay)": { px: 195, py: 225, region: "late-game" },
  "Route 9 (in Circhester Bay) (Surfing)": { px: 198, py: 220, region: "late-game" },
  "Route 9 (in Outer Spikemuth)": { px: 208, py: 290, region: "late-game" },
  "Route 9 (Surfing)": { px: 200, py: 220, region: "late-game" },
  "Route 10 (Near Station)": { px: 116, py: 165, region: "late-game" },
  "Route 10": { px: 117, py: 110, region: "late-game" },
};

const DEFAULT: SvgCoord = { px: MAP_WIDTH / 2, py: MAP_HEIGHT / 2, region: "special" };

function normalizeAreaName(name: string): string {
  return name.replace(/[\u2018\u2019]/g, "'");
}

export function getAreaSvgCoord(areaName: string): SvgCoord {
  return COORDS[normalizeAreaName(areaName)] ?? DEFAULT;
}

export const REGION_COLORS: Record<MapRegion, string> = {
  starter: "#4ade80",
  "wild-area": "#60a5fa",
  "mid-game": "#fbbf24",
  "late-game": "#f87171",
  special: "#c084fc",
};

export const REGION_LABELS: Record<MapRegion, string> = {
  starter: "Early Routes",
  "wild-area": "Wild Area",
  "mid-game": "Mid Game",
  "late-game": "Late Game",
  special: "Special",
};
