"use client";

import { Check, ChevronDown, Info, Send, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCrowdStore, uid } from "@/store/useCrowdStore";
import { toOrgZoneId, useStaffData } from "../store-adapter";

const REQUEST_HELP_TEXT =
  "Need backup in your zone? Request an extra volunteer when crowd pressure rises or you need support handling an alert.";

function InfoTip() {
  return (
    <div className="group relative shrink-0">
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-label="About Request Volunteer"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      <div
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-56 rounded-xl bg-slate-900 px-3 py-2.5 text-left text-xs leading-relaxed text-white opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <p className="font-semibold text-white">Request extra help</p>
        <p className="mt-1 text-slate-300">{REQUEST_HELP_TEXT}</p>
        <span className="absolute -top-1 right-2 h-2 w-2 rotate-45 bg-slate-900" />
      </div>
    </div>
  );
}

export function DispatchPanel({
  collapsible = false,
  defaultOpen = false,
  defaultZoneId,
}: {
  collapsible?: boolean;
  defaultOpen?: boolean;
  defaultZoneId?: string;
}) {
  const { volunteers, zones } = useStaffData();
  const dispatchStaff = useCrowdStore((s) => s.dispatchStaff);
  const addAlert = useCrowdStore((s) => s.addAlert);
  const addBroadcast = useCrowdStore((s) => s.addBroadcast);
  const log = useCrowdStore((s) => s.log);

  const [open, setOpen] = useState(defaultOpen);
  const [volunteerId, setVolunteerId] = useState<string>("");
  const [zoneId, setZoneId] = useState(defaultZoneId ?? "food-court");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Resolve the active volunteer from live data (default: first available).
  const effectiveVolunteerId =
    volunteerId ||
    volunteers.find((v) => v.status === "available")?.id ||
    volunteers[0]?.id ||
    "";
  const selected =
    volunteers.find((v) => v.id === effectiveVolunteerId) ?? volunteers[0];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;

    // Write the request into the SHARED store so the /org console sees it.
    const orgZoneId = toOrgZoneId(zoneId);
    const zoneName = zones.find((z) => z.id === zoneId)?.name ?? zoneId;

    // 1) move the chosen volunteer toward the target zone
    dispatchStaff(selected.id, orgZoneId);

    // 2) raise an alert org can triage (assigned to the requested volunteer)
    addAlert({
      id: uid("alert"),
      type: "staff_request",
      severity: "warning",
      zoneId: orgZoneId,
      message: message.trim()
        ? `Volunteer backup requested: ${message.trim()}`
        : "Volunteer backup requested by field staff",
      assignedTo: selected.id,
      status: "assigned",
      t: Date.now(),
    });

    // 3) broadcast + audit so it shows up across the org console
    addBroadcast({
      id: uid("bcast"),
      channel: "staff",
      severity: "warning",
      zoneIds: [orgZoneId],
      message: `${selected.name} dispatched to ${zoneName}${
        message.trim() ? ` — ${message.trim()}` : ""
      }`,
      sentAt: Date.now(),
    });
    log({
      kind: "dispatch",
      zoneId: orgZoneId,
      message: `Field request: ${selected.name} → ${zoneName}`,
    });

    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
    setMessage("");
  }

  // Store not seeded yet (first paint before the simulator seeds).
  if (!selected) {
    return (
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 h-24 animate-pulse rounded-xl bg-slate-50" />
      </section>
    );
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          Select Volunteer
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${selected.avatarColor}`}
            >
              {selected.initials}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-slate-900">
                {selected.name}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    selected.status === "available"
                      ? "bg-emerald-500"
                      : selected.status === "busy"
                        ? "bg-amber-400"
                        : "bg-slate-300"
                  }`}
                />
                {selected.status === "available"
                  ? "Available"
                  : selected.status === "busy"
                    ? "Busy"
                    : "Offline"}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <ul className="absolute z-30 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
              {volunteers.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setVolunteerId(v.id);
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50"
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${v.avatarColor}`}
                    >
                      {v.initials}
                    </span>
                    <span className="flex-1 text-sm font-medium text-slate-800">
                      {v.name}
                    </span>
                    {v.id === effectiveVolunteerId && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="dispatch-zone"
          className="mb-1.5 block text-xs font-medium text-slate-500"
        >
          Target Zone
        </label>
        <select
          id="dispatch-zone"
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="dispatch-message"
          className="mb-1.5 block text-xs font-medium text-slate-500"
        >
          Message (optional)
        </label>
        <textarea
          id="dispatch-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Need backup at Food Court for crowd control."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 active:scale-[0.99]"
      >
        {sent ? (
          <>
            <Check className="h-4 w-4" />
            Request Sent
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Request
          </>
        )}
      </button>
    </form>
  );

  if (!collapsible) {
    return (
      <section className="staff-card-hover flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"> <div className="mb-4 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-800">
              Request Volunteer
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Ask for backup when your zone needs help
            </p>
          </div>
          <InfoTip />
        </div>
        {form}
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex w-full items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <Users className="h-4 w-4 shrink-0 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-800">
            Request Volunteer
          </h2>
          <ChevronDown
            className={`ml-auto h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
          />
        </button>
        <InfoTip />
      </div>
      {open && (
        <div className="border-t border-slate-50 px-4 pb-4 pt-3">
          <p className="mb-3 text-xs text-slate-500">
            Ask for backup when your zone needs help
          </p>
          {form}
        </div>
      )}
    </section>
  );
}
