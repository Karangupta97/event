import type { Recommendation } from "./types";
import { CONGESTION_PROTOCOL } from "./protocols";
import { useCrowdStore, uid } from "@/store/useCrowdStore";
import type { Broadcast } from "@/features/comms/types";

const STEP_DELAY = 850; // ms between staggered step completions

/**
 * Executes a recommendation step-by-step with staggered side effects:
 *  0 broadcast  -> add broadcast + audit
 *  1 restrict   -> set zone flow = restricted
 *  2 dispatch   -> dispatch chosen staff (en_route w/ ETA)
 *  3 redirect   -> move a slice of crowd to the overflow zone
 * Finishes by marking the recommendation executed and resolving its alert.
 */
export function executeRecommendation(rec: Recommendation): void {
  const store = useCrowdStore.getState();
  const zone = store.zones.find((z) => z.id === rec.zoneId);
  const overflow = store.zones.find((z) => z.id === rec.overflowZoneId);
  if (!zone || !overflow) return;

  store.patchRecommendation(rec.id, { state: "executing", completedStep: -1 });

  const runStep = (i: number) => {
    const s = useCrowdStore.getState();
    switch (i) {
      case 0: {
        const b: Broadcast = {
          id: uid("bc"),
          channel: "attendees",
          severity: "warning",
          zoneIds: [zone.id, overflow.id],
          message: `${zone.name} is crowded. Please use ${overflow.name} — space available there.`,
          sentAt: Date.now(),
        };
        s.addBroadcast(b);
        s.log({
          kind: "broadcast",
          zoneId: zone.id,
          message: `Redirect notice sent to attendees near ${zone.name}`,
        });
        break;
      }
      case 1: {
        s.setZoneFlow(zone.id, "restricted");
        s.log({
          kind: "action",
          zoneId: zone.id,
          message: `${zone.name} entry restricted`,
        });
        break;
      }
      case 2: {
        rec.staffIds.forEach((sid) => s.dispatchStaff(sid, zone.id));
        const names = s.staff
          .filter((st) => rec.staffIds.includes(st.id))
          .map((st) => st.name);
        s.log({
          kind: "dispatch",
          zoneId: zone.id,
          message: `Dispatched ${names.join(", ")} to ${zone.name} (en route)`,
        });
        break;
      }
      case 3: {
        // read the live count so the shift reflects current occupancy
        const liveCount =
          s.zones.find((z) => z.id === zone.id)?.count ?? zone.count;
        const moved = Math.round(liveCount * CONGESTION_PROTOCOL.redirectFraction);
        s.adjustCount(zone.id, -moved);
        s.adjustCount(overflow.id, Math.round(moved * 0.8));
        s.log({
          kind: "action",
          zoneId: zone.id,
          message: `~${moved} people guided from ${zone.name} toward ${overflow.name}`,
        });
        break;
      }
    }
    s.patchRecommendation(rec.id, { completedStep: i });
  };

  rec.steps.forEach((_, i) => {
    setTimeout(() => runStep(i), STEP_DELAY * (i + 1));
  });

  // finalize after the last step
  setTimeout(
    () => {
      const s = useCrowdStore.getState();
      s.patchRecommendation(rec.id, { state: "executed" });
      // resolve the related open alert(s) for this zone
      const related = s.alerts.filter(
        (a) => a.zoneId === rec.zoneId && a.status !== "resolved",
      );
      related.forEach((a) => s.setAlertStatus(a.id, "resolved"));
      s.log({
        kind: "action",
        zoneId: rec.zoneId,
        message: `Action plan executed for ${zone.name} — zone recovering`,
      });
    },
    STEP_DELAY * (rec.steps.length + 1),
  );
}
