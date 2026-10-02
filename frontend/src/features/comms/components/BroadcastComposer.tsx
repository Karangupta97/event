"use client";

import { useState } from "react";
import { Radio, Send, Smartphone } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import type { BroadcastChannel, BroadcastSeverity } from "../types";
import { CHANNEL_LABEL } from "../types";
import { TEMPLATES } from "../templates";
import type { Zone } from "@/features/zones/types";
import { useCrowdStore, uid } from "@/store/useCrowdStore";

const CHANNELS: BroadcastChannel[] = ["attendees", "staff", "all"];
const SEVERITIES: BroadcastSeverity[] = ["info", "warning", "critical"];

const SEV_THEME: Record<BroadcastSeverity, { chip: string; dot: string }> = {
  info: { chip: "bg-blue-600 text-white", dot: "bg-blue-500" },
  warning: { chip: "bg-amber-500 text-white", dot: "bg-amber-500" },
  critical: { chip: "bg-red-600 text-white", dot: "bg-red-500" },
};

export function BroadcastComposer({ zones }: { zones: Zone[] }) {
  const addBroadcast = useCrowdStore((s) => s.addBroadcast);
  const log = useCrowdStore((s) => s.log);

  const [channel, setChannel] = useState<BroadcastChannel>("attendees");
  const [severity, setSeverity] = useState<BroadcastSeverity>("warning");
  const [targets, setTargets] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const zoneNames =
    targets.length === 0
      ? "all zones"
      : targets.map((id) => zones.find((z) => z.id === id)?.name ?? id).join(", ");

  const preview = text.trim() || "Your message preview will appear here.";

  function toggleZone(id: string) {
    setTargets((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  }

  function applyTemplate(id: string) {
    const tpl = TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    setSeverity(tpl.severity);
    setText(tpl.text.replace("{zone}", zoneNames));
  }

  function send() {
    if (!text.trim()) return;
    addBroadcast({
      id: uid("bc"),
      channel,
      severity,
      zoneIds: targets.length === 0 ? "all" : targets,
      message: text.trim(),
      sentAt: Date.now(),
    });
    log({
      kind: "broadcast",
      message: `Broadcast to ${CHANNEL_LABEL[channel]} (${zoneNames}): "${text.trim()}"`,
    });
    setText("");
    setSent(true);
    window.setTimeout(() => setSent(false), 1800);
  }

  return (
    <Card>
      <CardHeader
        title="Broadcast Composer"
        subtitle="Send a message to attendees or staff"
        icon={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Radio className="h-[18px] w-[18px]" />
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* form */}
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-500">Channel</p>
            <div className="flex gap-1.5">
              {CHANNELS.map((c) => (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                    channel === c
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {CHANNEL_LABEL[c]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-500">
              Target zones{" "}
              <span className="text-slate-400">(none = all)</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {zones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => toggleZone(z.id)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    targets.includes(z.id)
                      ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {z.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-500">Severity</p>
            <div className="flex gap-1.5">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                    severity === s
                      ? SEV_THEME[s].chip
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-500">
              Template or custom text
            </p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.id)}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Write a short, clear message…"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <Button fullWidth onClick={send} disabled={!text.trim()}>
            <Send className="h-4 w-4" />
            {sent ? "Broadcast sent!" : "Send Broadcast"}
          </Button>
        </div>

        {/* phone preview */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Smartphone className="h-3.5 w-3.5" /> Live preview
          </p>
          <div className="mx-auto w-full max-w-[260px] rounded-[2rem] border-[6px] border-slate-800 bg-slate-900 p-2 shadow-xl">
            <div className="rounded-[1.4rem] bg-gradient-to-b from-slate-700 to-slate-800 p-3 pt-6">
              <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-slate-500/60" />
              <div className="rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-bold text-white">
                    EF
                  </span>
                  <span className="flex-1 text-xs font-semibold text-slate-900">
                    EventFlow
                  </span>
                  <span className="text-[10px] text-slate-400 tnum">now</span>
                </div>
                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", SEV_THEME[severity].dot)}
                  />
                  <span className="text-[11px] font-medium capitalize text-slate-500">
                    {severity} · {CHANNEL_LABEL[channel]}
                  </span>
                </div>
                <p className="text-[13px] leading-snug text-slate-800">
                  {preview}
                </p>
                <p className="mt-1.5 text-[10px] text-slate-400">
                  {targets.length === 0
                    ? "All zones"
                    : zoneNames}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
