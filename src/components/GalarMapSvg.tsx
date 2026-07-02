import galarMapRaw from "./galarMap.svg" with { type: "text" };
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  REGION_COLORS,
  type MapRegion,
} from "@/data/area-coordinates";
import type { AreaStats } from "@/lib/types";

/** Inner SVG markup (everything inside the root <svg> tag). */
const GALAR_MAP_INNER = galarMapRaw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

interface GalarMapSvgProps {
  areas: AreaStats[];
  selectedAreaId: string | null;
  hoveredId: string | null;
  highlightAreaIds: Set<string>;
  dimUnhighlighted: boolean;
  onSelectArea: (areaId: string) => void;
  onHoverArea: (areaId: string | null) => void;
}

export function GalarMapSvg({
  areas,
  selectedAreaId,
  hoveredId,
  highlightAreaIds,
  dimUnhighlighted,
  onSelectArea,
  onHoverArea,
}: GalarMapSvgProps) {
  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      className="galar-map block select-none"
      role="img"
      aria-label="Galar region map"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="galar-map-base" dangerouslySetInnerHTML={{ __html: GALAR_MAP_INNER }} />

      <g className="galar-map-markers">
        {areas.map(a => {
          const { px, py, region } = a.coord;
          const isHighlighted = highlightAreaIds.has(a.area.id);
          const isSelected = selectedAreaId === a.area.id;
          const isHovered = hoveredId === a.area.id;
          const dimmed = dimUnhighlighted && !isHighlighted;
          const isComplete = a.percent === 100;
          const active = isHovered || isSelected;
          const fill = isComplete ? "#10b981" : REGION_COLORS[region as MapRegion];
          const r = active ? 5.5 : isHighlighted ? 4.5 : 3.5;

          return (
            <g
              key={a.area.id}
              opacity={dimmed ? 0.15 : 1}
              onClick={() => onSelectArea(a.area.id)}
              onMouseEnter={() => onHoverArea(a.area.id)}
              onMouseLeave={() => onHoverArea(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={px} cy={py} r={12} fill="transparent" />

              {isHighlighted && (
                <circle cx={px} cy={py} r={9} fill="none" stroke="#facc15" strokeWidth={2} />
              )}

              {isSelected && (
                <circle cx={px} cy={py} r={10} fill="none" stroke="#ffffff" strokeWidth={2.5} />
              )}

              <circle cx={px} cy={py} r={r} fill={fill} stroke="#ffffff" strokeWidth={1.5} />

              <title>
                {a.area.name} ({a.caught}/{a.total})
              </title>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
