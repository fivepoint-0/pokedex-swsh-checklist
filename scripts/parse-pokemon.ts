import { writeFileSync } from "node:fs";
import path from "node:path";

const SWORD_EXCLUSIVE = new Set([
  "Seedot", "Nuleaf", "Swirlix", "Scraggy", "Sawk", "Rufflet", "Solrock",
  "Gothita", "Braviary", "Jangmo-o", "Hakamo-o", "Deino", "Mawile", "Hitmonlee",
]);

const SHIELD_EXCLUSIVE = new Set([
  "Lotad", "Lombre", "Spritzee", "Croagunk", "Throh", "Vullaby", "Lunatone",
  "Solosis", "Mandibuzz", "Larvitar", "Goomy", "Hitmonchan",
]);

const NAME_FIXES: Record<string, string> = { Nuleaf: "Nuzleaf" };

interface PokemonEntry {
  name: string;
  displayName: string;
  rate: number;
  galarian: boolean;
}

interface SpawnGroup {
  spawnType: "overworld" | "non-overworld";
  weather: string;
  levelRange: string;
  pokemon: PokemonEntry[];
}

interface Area {
  id: string;
  name: string;
  spawns: SpawnGroup[];
}

function normalizeName(raw: string): { name: string; displayName: string; galarian: boolean } {
  const galarian = /-\d+$/.test(raw);
  const stripped = raw.replace(/-\d+$/, "");
  const name = NAME_FIXES[stripped] ?? stripped;
  return { name, displayName: galarian ? `${name} (Galarian)` : name, galarian };
}

function parsePokemonMd(content: string): Area[] {
  const start = content.indexOf("-------- POKEMON START --------");
  const end = content.indexOf("-------- POKEMON END --------");
  if (start === -1 || end === -1) throw new Error("POKEMON markers not found");

  const section = content.slice(start, end);
  const lines = section.split("\n");
  const areas: Area[] = [];
  let current: Area | null = null;
  let currentSpawn: SpawnGroup | null = null;

  for (const line of lines) {
    const areaMatch = line.match(/^(\d{3}) – (.+):$/);
    if (areaMatch) {
      if (current) areas.push(current);
      current = { id: areaMatch[1]!, name: areaMatch[2]!, spawns: [] };
      currentSpawn = null;
      continue;
    }

    const spawnMatch = line.match(/^(OVERWORLD|NON-OVERWORLD) – (.+?) \((Lv\. .+?)\):$/);
    if (spawnMatch && current) {
      currentSpawn = {
        spawnType: spawnMatch[1] === "OVERWORLD" ? "overworld" : "non-overworld",
        weather: spawnMatch[2]!,
        levelRange: spawnMatch[3]!,
        pokemon: [],
      };
      current.spawns.push(currentSpawn);
      continue;
    }

    const pokeMatch = line.match(/^– (.+?) (\d+)%$/);
    if (pokeMatch && currentSpawn) {
      const { name, displayName, galarian } = normalizeName(pokeMatch[1]!);
      currentSpawn.pokemon.push({
        name,
        displayName,
        rate: parseInt(pokeMatch[2]!, 10),
        galarian,
      });
    }
  }

  if (current) areas.push(current);
  return areas;
}

function buildPokemonIndex(areas: Area[]) {
  const byName = new Map<string, {
    name: string;
    displayName: string;
    galarian: boolean;
    version: "both" | "sword" | "shield";
    locations: { areaId: string; areaName: string; spawnType: string; weather: string; rate: number }[];
  }>();

  for (const area of areas) {
    for (const spawn of area.spawns) {
      for (const poke of spawn.pokemon) {
        const key = `${poke.name}${poke.galarian ? "-galar" : ""}`;
        if (!byName.has(key)) {
          let version: "both" | "sword" | "shield" = "both";
          if (SWORD_EXCLUSIVE.has(poke.name)) version = "sword";
          else if (SHIELD_EXCLUSIVE.has(poke.name)) version = "shield";

          byName.set(key, {
            name: poke.name,
            displayName: poke.displayName,
            galarian: poke.galarian,
            version,
            locations: [],
          });
        }
        byName.get(key)!.locations.push({
          areaId: area.id,
          areaName: area.name,
          spawnType: spawn.spawnType,
          weather: spawn.weather,
          rate: poke.rate,
        });
      }
    }
  }

  return [...byName.values()].sort((a, b) => a.displayName.localeCompare(b.displayName));
}

const mdPath = path.join(process.cwd(), "pokemon.md");
const outPath = path.join(process.cwd(), "src/data/pokemon-data.json");

const content = await Bun.file(mdPath).text();
const areas = parsePokemonMd(content);
const pokemon = buildPokemonIndex(areas);

const output = {
  generatedAt: new Date().toISOString(),
  areaCount: areas.length,
  pokemonCount: pokemon.length,
  areas,
  pokemon,
  swordExclusive: [...SWORD_EXCLUSIVE].map(n => NAME_FIXES[n] ?? n).sort(),
  shieldExclusive: [...SHIELD_EXCLUSIVE].sort(),
};

writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Wrote ${outPath}: ${areas.length} areas, ${pokemon.length} pokemon`);
