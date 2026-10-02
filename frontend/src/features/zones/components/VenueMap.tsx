"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Map as MapIcon, Maximize2, Ban } from "lucide-react";
import type { Zone } from "../types";
import { zonePct, zoneStatus, minutesToCritical } from "../types";
import { ZONE_THEME } from "@/components/ui/status";
import { ZONE_ICON } from "../zoneIcon";
import { STAGE_BLOCK, EXIT_BLOCK, TREES } from "../data";
import { ZoneTooltip } from "./ZoneTooltip";

const VIEW_W = 1000;
const VIEW_H = 680;

function chipFor(zone: Zone): { text: string; tone: "red" | "amber" } | null {
  const status = zoneStatus(zone.count, zone.capacity);
  if (zone.flow === "restricted") return { text: "Restricted", tone: "amber" };
  const mins = minutesToCritical(zone.history, zone.capacity);
  if (status === "high" && mins !== null)
    return { text: `critical in ~${mins} min`, tone: "red" };
  if (status === "busy" && zone.staff < zone.staffNeeded)
    return { text: `needs +${zone.staffNeeded - zone.staff} staff`, tone: "amber" };
  if (status === "high") return { text: "over capacity", tone: "red" };
  return null;
}

export function VenueMap({
  zones,
  selectedId,
  onSelect,
  svgOverlay,
}: {
  zones: Zone[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** optional extra SVG content drawn above zones (e.g. emergency exit routes) */
  svgOverlay?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  const hoveredZone = zones.find((z) => z.id === hovered) ?? null;
  const neighborZone =
    hoveredZone != null
      ? hoveredZone.neighbors
          .map((id) => zones.find((z) => z.id === id))
          .filter((z): z is Zone => !!z)
          .sort(
            (a, b) =>
              zonePct(a.count, a.capacity) - zonePct(b.count, b.capacity),
          )[0] ?? null
      : null;

  function handleMove(e: React.MouseEvent<SVGGElement>, id: string) {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setHovered(id);
    setTip({ x: px, y: py });
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full select-none"
        role="img"
        aria-label="Venue map showing zone occupancy"
      >
        <defs>
          <pattern
            id="mapgrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="#e8eef7"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="mapbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef3fb" />
            <stop offset="100%" stopColor="#e7edf7" />
          </linearGradient>
        </defs>

        {/* background */}
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} rx="20" fill="url(#mapbg)" />
        <rect
          x="0"
          y="0"
          width={VIEW_W}
          height={VIEW_H}
          rx="20"
          fill="url(#mapgrid)"
          opacity="0.6"
        />

        {/* faint path network */}
        <g stroke="#dbe4f0" strokeWidth="10" fill="none" strokeLinecap="round">
          <path d="M512 40 L512 640" opacity="0.7" />
          <path d="M40 360 L960 360" opacity="0.7" />
          <path d="M196 250 L512 212 L826 240" opacity="0.5" />
          <path d="M198 508 L512 520 L816 500" opacity="0.5" />
        </g>

        {/* decorative trees */}
        {TREES.map((t, i) => (
          <g key={i}>
            <circle cx={t.x} cy={t.y + 2} r={t.r} fill="#bbf7d0" opacity="0.5" />
            <circle cx={t.x} cy={t.y} r={t.r} fill="#86efac" />
          </g>
        ))}

        {/* stage block */}
        <g>
          <rect
            x={STAGE_BLOCK.x}
            y={STAGE_BLOCK.y}
            width={STAGE_BLOCK.w}
            height={STAGE_BLOCK.h}
            rx="10"
            fill="#64748b"
          />
          <text
            x={STAGE_BLOCK.x + STAGE_BLOCK.w / 2}
            y={STAGE_BLOCK.y + STAGE_BLOCK.h / 2 + 4}
            textAnchor="middle"
            fontSize="15"
            fontWeight="600"
            fill="#fff"
          >
            {STAGE_BLOCK.label}
          </text>
        </g>
        {/* stage arc hint */}
        <path
          d={`M${STAGE_BLOCK.x - 10} ${STAGE_BLOCK.y + STAGE_BLOCK.h + 30} Q512 ${STAGE_BLOCK.y + STAGE_BLOCK.h + 70} ${STAGE_BLOCK.x + STAGE_BLOCK.w + 10} ${STAGE_BLOCK.y + STAGE_BLOCK.h + 30}`}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="3"
        />

        {/* exit block */}
        <g>
          <rect
            x={EXIT_BLOCK.x}
            y={EXIT_BLOCK.y}
            width={EXIT_BLOCK.w}
            height={EXIT_BLOCK.h}
            rx="8"
            fill="#cbd5e1"
          />
          <text
            x={EXIT_BLOCK.x + EXIT_BLOCK.w / 2}
            y={EXIT_BLOCK.y + EXIT_BLOCK.h / 2 + 4}
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill="#475569"
          >
            {EXIT_BLOCK.label}
          </text>
        </g>

        {/* zones */}
        {zones.map((zone) => {
          const status = zoneStatus(zone.count, zone.capacity);
          const theme = ZONE_THEME[status];
          const isSelected = selectedId === zone.id;
          const isHovered = hovered === zone.id;
          const isHigh = status === "high";
          const chip = chipFor(zone);
          const Icon = ZONE_ICON[zone.id];

          return (
            <motion.g
              key={zone.id}
              onMouseMove={(e) => handleMove(e, zone.id)}
              onMouseLeave={() => {
                setHovered(null);
                setTip(null);
              }}
              onClick={() => onSelect(zone.id)}
              style={{ cursor: "pointer" }}
              animate={{ scale: isHovered ? 1.012 : 1 }}
              transformTemplate={({ scale }) =>
                `translate(${zone.labelPos.x}px, ${zone.labelPos.y}px) scale(${scale ?? 1}) translate(${-zone.labelPos.x}px, ${-zone.labelPos.y}px)`
              }
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              {/* pulsing glow for high zones */}
              {isHigh && !reduce && (
                <motion.path
                  d={zone.svgPath}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3"
                  animate={{ opacity: [0.15, 0.6, 0.15] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ filter: "blur(3px)" }}
                />
              )}
              <motion.path
                d={zone.svgPath}
                animate={{ fill: theme.svgFill }}
                transition={{ duration: 0.5 }}
                stroke={isSelected ? "#2563eb" : theme.svgStroke}
                strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 2}
                style={{
                  filter: isHovered
                    ? "brightness(1.03) drop-shadow(0 6px 14px rgba(15,23,42,0.12))"
                    : undefined,
                }}
              />

              {/* label + icon + count via foreignObject */}
              <foreignObject
                x={zone.labelPos.x - 90}
                y={zone.labelPos.y - 46}
                width="180"
                height="110"
                style={{ pointerEvents: "none", overflow: "visible" }}
              >
                <div className="flex flex-col items-center text-center">
                  <span
                    className="mb-1 flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: "#ffffffcc", color: theme.accent }}
                  >
                    {zone.flow === "closed" ? (
                      <Ban className="h-[18px] w-[18px]" />
                    ) : (
                      Icon && <Icon className="h-[18px] w-[18px]" />
                    )}
                  </span>
                  <span className="text-[15px] font-semibold leading-tight text-slate-800">
                    {zone.name}
                  </span>
                  <span className="tnum text-[13px] text-slate-500">
                    {zone.count.toLocaleString()} / {zone.capacity.toLocaleString()}
                  </span>
                  {chip && (
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        chip.tone === "red"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {chip.text}
                    </span>
                  )}
                </div>
              </foreignObject>
            </motion.g>
          );
        })}

        {/* optional overlay (emergency exit routes) */}
        {svgOverlay}

        {/* compass */}
        <g transform={`translate(${VIEW_W - 54}, 54)`}>
          <circle r="22" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
          <path d="M0 -12 L6 6 L0 1 L-6 6 Z" fill="#2563eb" />
          <text y="-26" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">
            N
          </text>
        </g>
      </svg>

      {/* "Venue Map" pill top-left */}
      <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
        <MapIcon className="h-4 w-4 text-slate-500" />
        Venue Map
      </div>

      {/* legend bottom-left */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs shadow-sm backdrop-blur">
        <LegendDot color="#22c55e" label="Normal" />
        <LegendDot color="#eab308" label="Busy" />
        <LegendDot color="#ef4444" label="High" />
      </div>

      {/* view full map bottom-right */}
      <button className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50">
        <Maximize2 className="h-3.5 w-3.5" />
        View full map
      </button>

      {/* hover tooltip */}
      <AnimatePresence>
        {hoveredZone && tip && (
          <ZoneTooltip
            zone={hoveredZone}
            neighborZone={neighborZone}
            x={`${tip.x}%`}
            y={`${tip.y}%`}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: color }}
      />
      <span className="text-slate-600">{label}</span>
    </span>
  );
}
