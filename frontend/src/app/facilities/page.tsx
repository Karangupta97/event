"use client";

import { useMemo, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui";
import {
  CoffeeIcon,
  RestroomIcon,
  MedicalIcon,
  WifiIcon,
  PinIcon,
  SearchIcon,
} from "../components/icons";
import { facilities, type Facility } from "../lib/data";

type FacilityType = Facility["type"];

const typeMeta: Record<
  FacilityType,
  { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; tone: string }
> = {
  food: { label: "Food", Icon: CoffeeIcon, tone: "bg-amber-50 text-amber-700" },
  restroom: { label: "Restrooms", Icon: RestroomIcon, tone: "bg-brand-soft text-brand" },
  medical: { label: "Medical", Icon: MedicalIcon, tone: "bg-rose-50 text-rose-700" },
  wifi: { label: "Wi-Fi", Icon: WifiIcon, tone: "bg-brand-soft text-brand" },
  water: { label: "Water", Icon: WifiIcon, tone: "bg-emerald-50 text-emerald-700" },
  atm: { label: "ATM", Icon: CoffeeIcon, tone: "bg-slate-100 text-slate-600" },
};

const filterTypes: (FacilityType | "all")[] = [
  "all",
  "food",
  "restroom",
  "medical",
  "water",
  "wifi",
  "atm",
];

export default function FacilitiesPage() {
  const [type, setType] = useState<FacilityType | "all">("all");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    return facilities.filter((f) => {
      const matchesType = type === "all" || f.type === type;
      const matchesQuery =
        query.trim() === "" ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.zone.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [type, query]);

  return (
    <div>
      <PageHeader
        title="Facilities Finder"
        subtitle="Nearest services around you"
      />

      <div className="space-y-4 p-4">
        {/* Search */}
        <div className="relative">
          <SearchIcon
            width={18}
            height={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search facilities or zones"
            className="w-full rounded-full border border-border bg-white py-3 pl-11 pr-4 text-sm shadow-soft outline-none transition-shadow placeholder:text-muted focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Type filter chips */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {filterTypes.map((t) => {
            const label = t === "all" ? "All" : typeMeta[t].label;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  type === t
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm"
                    : "border border-border bg-white text-muted hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {list.map((f) => {
            const meta = typeMeta[f.type];
            const Icon = meta.Icon;
            return (
              <Card key={f.id} interactive className="flex items-center gap-3.5">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${meta.tone}`}>
                  <Icon width={20} height={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{f.name}</p>
                  <p className="inline-flex items-center gap-1 text-[11px] text-muted">
                    <PinIcon width={12} height={12} /> {f.zone} · {f.distance}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {f.status}
                </span>
              </Card>
            );
          })}

          {list.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">
              No facilities match your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
