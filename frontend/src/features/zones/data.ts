import type { Zone } from "./types";

/**
 * Venue plan laid out in a 1000 x 680 SVG viewBox.
 * Shapes are hand-authored rounded polygons that echo the reference map:
 *  - Food Court / Gaming / Expo across the top
 *  - Stage block + Stage Area in the middle
 *  - Workshop Hall / Main Entry across the bottom
 */
export const INITIAL_ZONES: Zone[] = [
  {
    id: "gaming",
    name: "Gaming Zone",
    capacity: 800,
    count: 310,
    staff: 2,
    staffNeeded: 2,
    neighbors: ["food", "workshop"],
    flow: "open",
    svgPath:
      "M60 150 Q60 118 92 118 L300 128 Q330 130 330 162 L326 338 Q324 368 292 366 L96 356 Q64 354 64 322 Z",
    labelPos: { x: 196, y: 250 },
    history: [],
  },
  {
    id: "food",
    name: "Food Court",
    capacity: 1500,
    count: 1245,
    staff: 3,
    staffNeeded: 5,
    neighbors: ["gaming", "expo", "stage"],
    flow: "open",
    svgPath:
      "M372 128 Q372 96 404 96 L620 100 Q652 102 652 134 L648 300 Q646 330 614 328 L404 322 Q372 320 372 288 Z",
    labelPos: { x: 512, y: 212 },
    history: [],
  },
  {
    id: "expo",
    name: "Expo Zone",
    capacity: 1000,
    count: 620,
    staff: 3,
    staffNeeded: 3,
    neighbors: ["food", "entry"],
    flow: "open",
    svgPath:
      "M700 134 Q700 102 732 104 L930 128 Q962 132 960 164 L944 350 Q940 380 908 376 L720 352 Q690 348 692 318 Z",
    labelPos: { x: 826, y: 240 },
    history: [],
  },
  {
    id: "workshop",
    name: "Workshop Hall",
    capacity: 800,
    count: 430,
    staff: 2,
    staffNeeded: 2,
    neighbors: ["gaming", "stage"],
    flow: "open",
    svgPath:
      "M96 400 Q64 400 66 432 L82 584 Q86 614 118 612 L300 600 Q332 598 330 566 L322 430 Q320 400 288 402 Z",
    labelPos: { x: 198, y: 508 },
    history: [],
  },
  {
    id: "stage",
    name: "Stage Area",
    capacity: 1000,
    count: 482,
    staff: 4,
    staffNeeded: 4,
    neighbors: ["food", "workshop", "entry"],
    flow: "open",
    svgPath:
      "M372 404 Q372 374 404 374 L620 374 Q652 374 652 406 L648 586 Q646 616 614 614 L404 614 Q372 614 372 582 Z",
    labelPos: { x: 512, y: 520 },
    history: [],
  },
  {
    id: "entry",
    name: "Main Entry",
    capacity: 600,
    count: 210,
    staff: 2,
    staffNeeded: 2,
    neighbors: ["expo", "stage"],
    flow: "open",
    svgPath:
      "M700 410 Q700 380 732 380 L908 390 Q940 392 938 424 L926 584 Q924 614 892 612 L724 602 Q692 600 694 568 Z",
    labelPos: { x: 816, y: 500 },
    history: [],
  },
];

/** decorative, non-interactive props drawn under/over zones */
export const STAGE_BLOCK = { x: 452, y: 320, w: 120, h: 44, label: "Stage" };
export const EXIT_BLOCK = { x: 462, y: 628, w: 100, h: 34, label: "Exit" };

/** small decorative trees (green dots) scattered on the map background */
export const TREES: { x: number; y: number; r: number }[] = [
  { x: 40, y: 90, r: 7 },
  { x: 350, y: 70, r: 6 },
  { x: 672, y: 80, r: 7 },
  { x: 978, y: 100, r: 6 },
  { x: 350, y: 360, r: 6 },
  { x: 674, y: 360, r: 7 },
  { x: 40, y: 380, r: 7 },
  { x: 978, y: 372, r: 6 },
  { x: 44, y: 620, r: 7 },
  { x: 350, y: 630, r: 6 },
  { x: 676, y: 628, r: 7 },
  { x: 968, y: 616, r: 6 },
  { x: 512, y: 60, r: 6 },
];

/** exit routing used by emergency overlay (arrow from zone label toward exit) */
export const EXIT_ROUTES: Record<string, { to: { x: number; y: number }; label: string }> = {
  gaming: { to: { x: 300, y: 400 }, label: "→ West Exit" },
  food: { to: { x: 512, y: 300 }, label: "→ Central Exit" },
  expo: { to: { x: 820, y: 360 }, label: "→ East Exit" },
  workshop: { to: { x: 330, y: 560 }, label: "→ West Exit" },
  stage: { to: { x: 512, y: 640 }, label: "→ Main Exit" },
  entry: { to: { x: 816, y: 600 }, label: "→ Main Entry" },
};
