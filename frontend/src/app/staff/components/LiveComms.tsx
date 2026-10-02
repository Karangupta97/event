"use client";

import { useState } from "react";
import { Radio, Send, CheckCircle2, Volume2, X, MessageSquare, AlertCircle } from "lucide-react";
import { useStaffData } from "../store-adapter";

const QUICK_UPDATES = [
  "Entry line clear 👍",
  "Barriers requested here ⚠️",
  "Medical assistance provided ✅",
  "High crowd density alert 🚨",
  "Water station refilled 💧",
];

/**
 * Live broadcast banner that notifies field staff of announcements from Org Command.
 */
export function LiveBroadcastBanner() {
  const { latestBroadcast, acknowledgeBroadcast, session } = useStaffData();
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  if (!latestBroadcast || latestBroadcast.id === dismissedId) {
    return null;
  }

  const isCritical = latestBroadcast.severity === "critical";
  const isWarning = latestBroadcast.severity === "warning";

  const handleAck = () => {
    acknowledgeBroadcast(latestBroadcast.id);
    setAcknowledged(true);
    setTimeout(() => {
      setDismissedId(latestBroadcast.id);
      setAcknowledged(false);
    }, 1500);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-md transition-all duration-300 ${
        isCritical
          ? "border-red-300 bg-red-50/95 text-red-900"
          : isWarning
            ? "border-amber-300 bg-amber-50/95 text-amber-900"
            : "border-blue-200 bg-blue-50/95 text-blue-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${
            isCritical
              ? "bg-red-600 animate-pulse"
              : isWarning
                ? "bg-amber-500"
                : "bg-blue-600"
          }`}
        >
          <Volume2 className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isCritical
                    ? "bg-red-200 text-red-800"
                    : isWarning
                      ? "bg-amber-200 text-amber-800"
                      : "bg-blue-200 text-blue-800"
                }`}
              >
                Org Broadcast · {latestBroadcast.channel}
              </span>
              <span className="text-[11px] opacity-75">
                {new Date(latestBroadcast.sentAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDismissedId(latestBroadcast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-sm font-semibold leading-snug">
            {latestBroadcast.message}
          </p>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="text-[11px] opacity-80">
              For: {session.zoneId.replace(/-/g, " ")} & team
            </span>
            <button
              type="button"
              onClick={handleAck}
              disabled={acknowledged}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                acknowledged
                  ? "bg-emerald-600 text-white"
                  : isCritical
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {acknowledged ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledged
                </>
              ) : (
                "✓ Acknowledge Receipt"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Direct Field Radio / Two-Way Comms box to message Org Command.
 */
export function FieldCommsBox() {
  const { sendFieldMessage } = useStaffData();
  const [text, setText] = useState("");
  const [sentNotice, setSentNotice] = useState(false);

  const handleSend = (msgToSend?: string) => {
    const content = msgToSend ?? text;
    if (!content.trim()) return;
    sendFieldMessage(content);
    if (!msgToSend) setText("");
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-800">
            Field Comms → Org Command
          </h2>
        </div>
        {sentNotice && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            <CheckCircle2 className="h-3 w-3" /> Transmitted
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {QUICK_UPDATES.map((update) => (
          <button
            key={update}
            type="button"
            onClick={() => handleSend(update)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
          >
            {update}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send real-time field update to organizer..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" /> Send
        </button>
      </form>
    </section>
  );
}

/**
 * List of recent broadcasts received from Org Command.
 */
export function BroadcastsList() {
  const { broadcasts } = useStaffData();

  if (broadcasts.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-center py-6">
        <MessageSquare className="mx-auto h-6 w-6 text-slate-300 mb-1.5" />
        <p className="text-xs font-medium text-slate-600">No organizer broadcasts yet</p>
        <p className="text-[11px] text-slate-400">
          Messages broadcasted from Org Command will appear here live.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-800">
            Org Broadcasts ({broadcasts.length})
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">Real-time sync</span>
      </div>
      <ul className="space-y-2.5">
        {broadcasts.slice(0, 5).map((b) => (
          <li
            key={b.id}
            className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs text-slate-700"
          >
            <span
              className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                b.severity === "critical"
                  ? "bg-red-500"
                  : b.severity === "warning"
                    ? "bg-amber-400"
                    : "bg-blue-500"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-semibold text-slate-900 capitalize">
                  {b.channel} Broadcast
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(b.sentAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{b.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
