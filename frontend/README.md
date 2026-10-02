# Venuro — Organizer Operations Dashboard

A hackathon MVP for **Smart Event Crowd Management**. It gives an event
organizer a single screen to answer, in about three seconds: _Is anything
wrong? Where? What should I do?_

The core loop is **Detect → Predict → Act → Resolve**. All data is simulated
in the browser — no backend, no database, no auth, no network calls.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (tokens live in `src/app/globals.css` via `@theme`)
- **Zustand** for state
- **Recharts** for the zone trend chart
- **Framer Motion** for reveals, count-ups and transitions
- **lucide-react** icons, **Inter** via `next/font`

> Note: the brief specified Next.js 14; this workspace was already scaffolded
> on Next.js 16 + React 19, so the app targets that. The code uses only
> stable App Router APIs and would port back to 14 with no changes.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build / checks:

```bash
npm run build    # type-checks + builds
npm run lint     # eslint (clean)
```

## Routes

The console is a multi-page app under `/org`, sharing one persistent layout
(sidebar + header + simulator), so live state carries across every route:

| Route | Purpose |
| --- | --- |
| `/org` | Command Overview — live crowd strip, KPIs, map, critical alerts, recommended action |
| `/org/map` | Live Map — large venue map, zone selector, trend + zone detail |
| `/org/alerts` | Alerts & incidents — severity breakdown, triage queue, assign/resolve |
| `/org/dispatch` | Dispatch board — dispatch form, en-route tracking, zone staffing gaps |
| `/org/staff` | Staff management — role breakdown, roster by zone, coverage |
| `/org/broadcast` | Broadcast center — composer, phone preview, sent history |
| `/org/analytics` | Analytics — occupancy charts, venue trend, activity log |
| `/org/settings` | Settings — thresholds, simulation controls, zone config |

`/` is reserved for the public landing page.

## Demo script (≈60 seconds)

1. **Load `/org`.** KPIs count up, the live crowd strip shows every zone. Food
   Court is already amber (~83%) and a **Recommended Action** is waiting in the
   decision rail.
2. **Trigger congestion.** Open the floating **Demo** panel (bottom-right, on
   any page) and click **Lunch rush** — or use the controls on `/org/settings`.
   Food Court climbs into the red, the priority banner shows the alert, and a
   `critical in ~N min` chip appears on the map tile.
3. **Act.** In the Recommended Action card click **Approve & Execute**. Steps
   tick off one by one: a redirect broadcast is sent, Food Court entry is
   restricted, two volunteers are dispatched, and ~15% of the crowd is guided
   to the lowest-occupancy neighbour. Occupancy drops and the card collapses to
   **Executed**. Navigate to `/org/dispatch` to watch the dispatched staff
   count down their ETA, or `/org/alerts` to see the incident resolve — state
   persists across pages.
4. **Emergency.** Click **Emergency** in the header, pick a scenario, and
   **press and hold for 2 seconds** to confirm. A red banner slides down with a
   live _people still inside_ counter, the map draws exit arrows, and
   **Stand down** logs the duration.

Other demo buttons: **Concert starts** (surge into Stage Area),
**Show ends** (exit surge toward Main Entry), **Reset** (back to seed).

## How it works

- **Simulator** (`features/simulator/engine.ts`) ticks every 2s: each zone
  drifts, counts are clamped to `0 .. capacity * 1.2`, staff ETAs count down and
  arrivals re-home into their destination zone.
- **Early warning**: a linear fit over the last ~15 readings gives
  minutes-to-critical (`features/zones/types.ts`).
- **Alerts** are derived each tick and **deduped per zone + severity**; they
  auto-resolve when a zone returns to normal (`features/alerts/engine.ts`).
- **Protocols are data** (`features/actions/protocols.ts`). `recommend.ts`
  picks the overflow zone (lowest-occupancy non-closed neighbour) and the best
  available staff; `execute.ts` runs the ordered steps with staggered side
  effects.
- **Status rules**: `<70%` Normal · `70–90%` Busy · `>90%` High.

## Architecture

Feature-based. Logic lives in plain `.ts` files; components in `components/`.
Features never import each other's components — they share state through the
Zustand store only (`store/useCrowdStore.ts`).

```
src/
  app/
    page.tsx      landing placeholder (/)
    org/
      layout.tsx  persistent console shell (sidebar + header + simulator)
      page.tsx    Overview, plus map/ alerts/ dispatch/ staff/
                  broadcast/ analytics/ settings/ route pages
  components/ui/  Card, Button, Pill/Badge, Reveal, AnimatedNumber, Sidebar,
                  Header, MobileNav, PageContainer, OrgGate, nav, status tokens
  features/
    zones/        map, KPI row, trend, overview table, data + types
    simulator/    tick engine, demo scenarios, useSimulator hook
    alerts/       engine + priority banner + active alerts list
    actions/      protocols, recommend, execute, Recommended Action card
    staff/        roster, dispatch form, deploy helpers
    comms/        broadcast composer, templates
    emergency/    modal (press-and-hold), banner, exit overlay
    audit/        activity log
  store/          useCrowdStore.ts (single source of truth)
```

## Accessibility & motion

- Light, high-contrast theme; tabular numbers for all figures.
- Honours `prefers-reduced-motion`: pulses and the press-and-hold animation are
  disabled, and the emergency confirm falls back to a single click.
- Animations are limited to `transform` / `opacity`.

> Full WCAG conformance would require manual testing with assistive
> technologies and an expert review; this MVP covers the common cases.
