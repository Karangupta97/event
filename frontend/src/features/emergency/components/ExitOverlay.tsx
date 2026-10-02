"use client";

import { motion } from "framer-motion";
import type { Zone } from "@/features/zones/types";
import { EXIT_ROUTES } from "@/features/zones/data";

/**
 * SVG overlay (rendered inside the map's <svg>) drawing an exit arrow + label
 * from each zone label toward its assigned exit. Uses EXIT_ROUTES lookup.
 */
export function ExitOverlay({ zones }: { zones: Zone[] }) {
  return (
    <g>
      <defs>
        <marker
          id="exitArrow"
          markerWidth="10"
          markerHeight="10"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 L6 3 L0 6 Z" fill="#dc2626" />
        </marker>
      </defs>
      {zones.map((z) => {
        const route = EXIT_ROUTES[z.id];
        if (!route) return null;
        const from = z.labelPos;
        return (
          <g key={z.id}>
            <motion.line
              x1={from.x}
              y1={from.y}
              x2={route.to.x}
              y2={route.to.y}
              stroke="#dc2626"
              strokeWidth="3"
              strokeDasharray="8 6"
              markerEnd="url(#exitArrow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 0.6 }}
            />
            <foreignObject
              x={route.to.x - 50}
              y={route.to.y - 10}
              width="100"
              height="24"
              style={{ overflow: "visible", pointerEvents: "none" }}
            >
              <div className="flex justify-center">
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                  {route.label}
                </span>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </g>
  );
}
