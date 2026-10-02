<<<<<<< Updated upstream
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import ScrollReveal from "@/app/components/ScrollReveal";
import LiveEventCard from "@/app/components/LiveEventCard";
=======
import Link from "next/link";
import { Card, CrowdBadge, CapacityBar, SectionTitle } from "./components/ui";
import {
  ChevronRightIcon,
  MapIcon,
  FacilitiesIcon,
  ClockIcon,
  PinIcon,
} from "./components/icons";
import { eventInfo, zones, eventUpdates } from "./lib/data";
>>>>>>> Stashed changes

export const metadata: Metadata = {
  title: "SmartFlow — Smart Event Crowd Management",
  description:
    "Real-time intelligence that helps event teams monitor crowds, predict congestion, and coordinate the response before small bottlenecks become operational problems.",
};

/* ─── zone data ───────────────────────────────────────── */
const zones = [
  { name: "Main Stage",    pct: 82, status: "Warning",  bar: "#D97706" },
  { name: "Food Court",    pct: 94, status: "Critical", bar: "#DC2626" },
  { name: "Gate A",        pct: 71, status: "Normal",   bar: "#16A34A" },
  { name: "Activity Zone", pct: 56, status: "Normal",   bar: "#16A34A" },
];

const badgeClass: Record<string, string> = {
  Critical: "badge badge-crit",
  Warning:  "badge badge-warn",
  Normal:   "badge badge-ok",
};

const dotClass: Record<string, string> = {
  Critical: "status-dot dot-crit",
  Warning:  "status-dot dot-warn",
  Normal:   "status-dot dot-ok",
};

/* ─── feature data ───────────────────────────────────── */
const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#2563EB" fillOpacity="0.9"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#2563EB" fillOpacity="0.45"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#2563EB" fillOpacity="0.45"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#2563EB" fillOpacity="0.9"/>
      </svg>
    ),
    title: "Live Zone Monitoring",
    desc: "Track occupancy across every zone in real time — from main stages to entry gates.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 10 Q7 4 10 10 Q13 16 17 10" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="10" cy="10" r="2" fill="#2563EB"/>
      </svg>
    ),
    title: "Crowd Flow Analysis",
    desc: "Understand how attendees move between zones and where pressure is building.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="#2563EB" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: "Early Risk Detection",
    desc: "Identify zones approaching critical capacity before they reach a tipping point.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2C10 2 4 5 4 11V14L10 17L16 14V11C16 5 10 2 10 2Z" stroke="#2563EB" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
        <path d="M10 8V10.5" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="10" cy="13" r="0.8" fill="#2563EB"/>
      </svg>
    ),
    title: "Smart Alerts",
    desc: "Surface the issues that need attention, not noise. Actionable signals, not dashboards of data.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="6" r="3" stroke="#2563EB" strokeWidth="1.6" fill="none"/>
        <path d="M4 17C4 13.686 6.686 11 10 11C13.314 11 16 13.686 16 17" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    title: "Staff Coordination",
    desc: "Give operations teams a clear picture of where support is needed and how to deploy it.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 10H17M13 5L17 10L13 15" stroke="#2563EB" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Attendee Redirection",
    desc: "Recommend alternative routes and less crowded zones before congestion builds.",
  },
];

/* ─── page ────────────────────────────────────────── */
export default function Home() {
  const busiest = [...zones].sort((a, b) => b.capacity - a.capacity).slice(0, 3);

  return (
<<<<<<< Updated upstream
    <>
      <Navbar />
      <ScrollReveal />
      <main>

        {/* ════════════════════════════════════════════
            SECTION 01 — HERO
            Dark video only; rest of page is light.
        ════════════════════════════════════════════ */}
        <section
          id="overview"
          style={{
            position: "relative",
            width: "100%",
            minHeight: "95vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
          aria-label="Hero section"
        >
          <video
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
            src="/landingbg.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "linear-gradient(105deg, rgba(8,12,28,0.78) 0%, rgba(8,12,28,0.55) 42%, rgba(8,12,28,0.18) 75%, transparent 100%)",
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50px",
              zIndex: 2,
              background:
                "linear-gradient(to bottom, transparent 0%, #F8F7F3 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 3,
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 32px",
              paddingTop: "100px",
              paddingBottom: "140px",
              width: "100%",
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <p
                className="reveal"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "20px",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  paddingBottom: "8px",
                }}
              >
                Smart Event Operations
              </p>

              <h1
                className="reveal reveal-d1"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(3rem, 6vw, 5.25rem)",
                  fontWeight: 400,
                  lineHeight: 1.06,
                  color: "#ffffff",
                  marginBottom: "28px",
                  letterSpacing: "-0.01em",
                }}
              >
                Keep the crowd
                <br />
                <em style={{ color: "#2563EB", fontStyle: "italic" }}>moving.</em>
              </h1>

              <p
                className="reveal reveal-d2"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.125rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.72)",
                  maxWidth: 500,
                  marginBottom: "40px",
                }}
              >
                Real-time intelligence that helps event teams monitor crowds,
                predict congestion, and coordinate the response before small
                bottlenecks become operational problems.
              </p>

              <div
                className="reveal reveal-d3"
                style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}
              >
                <a href="#dashboard" className="btn btn-blue">
                  Explore Live Dashboard
                  <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#how-it-works" className="btn btn-ghost-video">
                  See How It Works
                  <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <LiveEventCard />
        </section>

        <section
          style={{ background: "#F8F7F3", padding: "112px 0" }}
          aria-labelledby="challenge-heading"
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "48px",
                alignItems: "start",
                marginBottom: "72px",
              }}
              className="responsive-2col"
            >
              <div>
                <p className="label reveal" style={{ marginBottom: 16 }}>The Challenge</p>
                <h2
                  id="challenge-heading"
                  className="reveal reveal-d1"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.25rem, 3.5vw, 3.25rem)",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    color: "#172033",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Crowd problems
                  <br />
                  start small.
                  <br />
                  <span style={{ color: "#667085" }}>They don&apos;t stay that way.</span>
                </h2>
              </div>
              <div style={{ paddingTop: 8 }}>
                <p
                  className="reveal reveal-d2"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.0625rem",
                    lineHeight: 1.75,
                    color: "#667085",
                    maxWidth: 480,
                  }}
                >
                  A stage change, a busy entrance, a popular food court, or sudden
                  movement between zones can quickly change how people flow through an
                  event. By the time congestion becomes obvious, operations teams are
                  already reacting instead of preparing.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
              }}
              className="responsive-3col"
            >
              {[
                {
                  n: "01",
                  title: "Uneven crowd distribution",
                  desc: "People naturally concentrate around high-interest areas while nearby zones remain underused, creating invisible pressure points.",
                },
                {
                  n: "02",
                  title: "Sudden crowd movement",
                  desc: "Schedule changes, announcements, and incidents can move large groups between zones within minutes — faster than manual coordination allows.",
                },
                {
                  n: "03",
                  title: "Entry and exit bottlenecks",
                  desc: "Queues, narrow routes, and restricted exits can quickly slow movement and turn a manageable situation into an operational problem.",
                },
              ].map((card, i) => (
                <div
                  key={card.n}
                  className={`problem-card reveal reveal-d${i + 1}`}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "#2563EB",
                      marginBottom: 16,
                    }}
                  >
                    {card.n}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1.0625rem",
                      fontWeight: 600,
                      color: "#172033",
                      lineHeight: 1.35,
                      marginBottom: 12,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.65,
                      color: "#667085",
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{ background: "#FFFFFF", padding: "112px 0" }}
          aria-labelledby="approach-heading"
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 72px" }}>
              <p className="label reveal" style={{ marginBottom: 16 }}>The Smarter Approach</p>
              <h2
                id="approach-heading"
                className="reveal reveal-d1"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.25rem, 3.5vw, 3.25rem)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: "#172033",
                  letterSpacing: "-0.01em",
                  marginBottom: 20,
                }}
              >
                Don&apos;t just monitor
                <br />
                the crowd. Understand
                <br />
                <span style={{ color: "#667085" }}>where it&apos;s going.</span>
              </h2>
              <p
                className="reveal reveal-d2"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.0625rem",
                  lineHeight: 1.72,
                  color: "#667085",
                }}
              >
                SmartFlow turns live occupancy and movement data into clear
                operational insight — helping teams identify risk, anticipate
                congestion, and coordinate the response in real time.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                position: "relative",
              }}
              className="responsive-4col"
            >
              {[
                {
                  n: "01",
                  label: "Detect",
                  desc: "Capture live occupancy and movement data across every event zone.",
                },
                {
                  n: "02",
                  label: "Predict",
                  desc: "Identify zones trending toward critical capacity before they arrive.",
                },
                {
                  n: "03",
                  label: "Alert",
                  desc: "Surface emerging risks as clear, actionable signals.",
                },
                {
                  n: "04",
                  label: "Act",
                  desc: "Guide attendees and deploy staff exactly where they are needed.",
                },
              ].map((step, i) => (
                <div
                  key={step.n}
                  className={`step-card reveal reveal-d${i + 1}`}
                  style={{ position: "relative" }}
                >
                  {i < 3 && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: 44,
                        right: -9,
                        width: 18,
                        height: 1,
                        background: "linear-gradient(90deg, #2563EB 0%, #93C5FD 100%)",
                        opacity: 0.35,
                        zIndex: 2,
                      }}
                      className="step-connector"
                    />
                  )}
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "#2563EB",
                      marginBottom: 12,
                    }}
                  >
                    {step.n}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "#172033",
                      marginBottom: 10,
                    }}
                  >
                    {step.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.65,
                      color: "#667085",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="dashboard"
          style={{ background: "#F2F1EC", padding: "112px 0" }}
          aria-labelledby="dashboard-heading"
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
            <div style={{ maxWidth: 560, marginBottom: 56 }}>
              <p className="label reveal" style={{ marginBottom: 16 }}>The Operations View</p>
              <h2
                id="dashboard-heading"
                className="reveal reveal-d1"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.25rem, 3.5vw, 3rem)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: "#172033",
                  letterSpacing: "-0.01em",
                  marginBottom: 16,
                }}
              >
                One view of
                the entire event.
              </h2>
              <p
                className="reveal reveal-d2"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.0625rem",
                  lineHeight: 1.7,
                  color: "#667085",
                }}
              >
                See where people are, where they&apos;re moving, and which zones need
                attention — without switching between disconnected tools.
              </p>
            </div>

            <div className="dash-frame reveal-scale">
              <div className="dash-titlebar">
                <span className="dash-dot" style={{ background: "#FC5F57" }} aria-hidden="true"/>
                <span className="dash-dot" style={{ background: "#FDBC2C" }} aria-hidden="true"/>
                <span className="dash-dot" style={{ background: "#29CB41" }} aria-hidden="true"/>
                <span
                  style={{
                    marginLeft: 12,
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#98A2B3",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  SmartFlow Operations — Live View
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 10px",
                    background: "#FEE2E2",
                    borderRadius: 20,
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#DC2626",
                    letterSpacing: "0.05em",
                  }}
                >
                  <span className="status-dot dot-live" />
                  LIVE
                </span>
              </div>

              <div
                style={{
                  padding: "24px",
                  background: "#F8F7F3",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 14,
                  }}
                  className="responsive-4col-sm"
                >
                  {[
                    { label: "Total Attendees",   value: "12,480", sub: "Across all zones" },
                    { label: "Overall Occupancy", value: "68%",    sub: "Within capacity" },
                    { label: "Zones at Risk",     value: "3",      sub: "Require attention", highlight: true },
                    { label: "Staff Deployed",    value: "42/50",  sub: "8 available" },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E4E7EC",
                        borderRadius: 8,
                        padding: "18px 20px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: "#98A2B3",
                          marginBottom: 6,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {kpi.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "1.75rem",
                          fontWeight: 700,
                          color: kpi.highlight ? "#DC2626" : "#172033",
                          lineHeight: 1,
                          marginBottom: 4,
                        }}
                      >
                        {kpi.value}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.75rem",
                          color: "#98A2B3",
                        }}
                      >
                        {kpi.sub}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 340px",
                    gap: 16,
                    alignItems: "start",
                  }}
                  className="responsive-map"
                >
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E4E7EC",
                      borderRadius: 8,
                      padding: "20px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#98A2B3",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 16,
                      }}
                    >
                      Venue Zone Map
                    </p>
                    <div
                      style={{ width: "100%", aspectRatio: "16/7", position: "relative" }}
                      role="img"
                      aria-label="Venue zone map showing crowd occupancy by zone"
                    >
                      <svg
                        viewBox="0 0 720 280"
                        style={{ width: "100%", height: "100%" }}
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <rect x="6" y="6" width="708" height="268" rx="10"
                          fill="none" stroke="#E4E7EC" strokeWidth="1.5" />
                        <rect x="22" y="22" width="318" height="108" rx="7"
                          fill="rgba(217,119,6,0.08)" stroke="#D97706" strokeWidth="1.2"/>
                        <text x="181" y="68" textAnchor="middle"
                          fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#172033">
                          Main Stage
                        </text>
                        <text x="181" y="86" textAnchor="middle"
                          fontFamily="var(--font-sans)" fontSize="11" fill="#D97706">
                          82% · Warning
                        </text>
                        <rect x="100" y="100" width="162" height="4" rx="2" fill="#EEF0F3"/>
                        <rect x="100" y="100" width="133" height="4" rx="2" fill="#D97706"/>
                        <rect x="380" y="22" width="318" height="108" rx="7"
                          fill="rgba(220,38,38,0.08)" stroke="#DC2626" strokeWidth="1.2"/>
                        <text x="539" y="68" textAnchor="middle"
                          fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#172033">
                          Food Court
                        </text>
                        <text x="539" y="86" textAnchor="middle"
                          fontFamily="var(--font-sans)" fontSize="11" fill="#DC2626">
                          94% · Critical
                        </text>
                        <rect x="458" y="100" width="162" height="4" rx="2" fill="#EEF0F3"/>
                        <rect x="458" y="100" width="152" height="4" rx="2" fill="#DC2626"/>
                        <rect x="22" y="152" width="318" height="108" rx="7"
                          fill="rgba(22,163,74,0.06)" stroke="rgba(22,163,74,0.35)" strokeWidth="1.2"/>
                        <text x="181" y="200" textAnchor="middle"
                          fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#172033">
                          Gate A
                        </text>
                        <text x="181" y="218" textAnchor="middle"
                          fontFamily="var(--font-sans)" fontSize="11" fill="#16A34A">
                          71% · Normal
                        </text>
                        <rect x="100" y="232" width="162" height="4" rx="2" fill="#EEF0F3"/>
                        <rect x="100" y="232" width="115" height="4" rx="2" fill="#16A34A"/>
                        <rect x="380" y="152" width="318" height="108" rx="7"
                          fill="rgba(22,163,74,0.04)" stroke="rgba(22,163,74,0.2)" strokeWidth="1.2"/>
                        <text x="539" y="200" textAnchor="middle"
                          fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#172033">
                          Activity Zone
                        </text>
                        <text x="539" y="218" textAnchor="middle"
                          fontFamily="var(--font-sans)" fontSize="11" fill="#16A34A">
                          56% · Normal
                        </text>
                        <rect x="458" y="232" width="162" height="4" rx="2" fill="#EEF0F3"/>
                        <rect x="458" y="232" width="91" height="4" rx="2" fill="#16A34A" fillOpacity="0.7"/>
                        <defs>
                          <marker id="arr-amber" markerWidth="7" markerHeight="7"
                            refX="5" refY="3.5" orient="auto">
                            <path d="M0 0.5 L6 3.5 L0 6.5Z" fill="#D97706" fillOpacity="0.6"/>
                          </marker>
                          <marker id="arr-gray" markerWidth="7" markerHeight="7"
                            refX="5" refY="3.5" orient="auto">
                            <path d="M0 0.5 L6 3.5 L0 6.5Z" fill="#98A2B3" fillOpacity="0.55"/>
                          </marker>
                        </defs>
                        <path d="M340 76 L380 76" stroke="#D97706" strokeWidth="1.4"
                          strokeDasharray="4 3" markerEnd="url(#arr-amber)" opacity="0.65"/>
                        <path d="M181 152 L181 130" stroke="#98A2B3" strokeWidth="1.2"
                          strokeDasharray="4 3" markerEnd="url(#arr-gray)" opacity="0.5"/>
                        <path d="M340 206 L380 206" stroke="#98A2B3" strokeWidth="1.2"
                          strokeDasharray="4 3" markerEnd="url(#arr-gray)" opacity="0.4"/>
                      </svg>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E4E7EC",
                        borderRadius: 8,
                        padding: "18px 20px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#98A2B3",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 14,
                        }}
                      >
                        Zone Occupancy
                      </p>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                        {zones.map((z) => (
                          <li key={z.name}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 6,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <span className={dotClass[z.status]} />
                                <span
                                  style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "0.8125rem",
                                    fontWeight: 500,
                                    color: "#374151",
                                  }}
                                >
                                  {z.name}
                                </span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span
                                  style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "0.8125rem",
                                    fontWeight: 600,
                                    color: "#172033",
                                  }}
                                >
                                  {z.pct}%
                                </span>
                                <span className={badgeClass[z.status]}>{z.status}</span>
                              </div>
                            </div>
                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{ width: `${z.pct}%`, background: z.bar }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      style={{
                        background: "#FEF2F2",
                        border: "1.5px solid rgba(220,38,38,0.18)",
                        borderRadius: 8,
                        padding: "16px 18px",
                      }}
                      role="alert"
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          color: "#DC2626",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          marginBottom: 6,
                        }}
                      >
                        Predicted Breach — Food Court
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.8125rem",
                          lineHeight: 1.55,
                          color: "#374151",
                          marginBottom: 10,
                        }}
                      >
                        Critical capacity predicted in approximately{" "}
                        <strong style={{ color: "#DC2626" }}>4 minutes</strong>.
                      </p>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                        {['Redirect attendees to Food Court B', 'Deploy 2 staff to the junction'].map((action) => (
                          <li
                            key={action}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 7,
                              fontFamily: "var(--font-sans)",
                              fontSize: "0.8125rem",
                              color: "#374151",
                            }}
                          >
                            <span style={{ color: "#2563EB", fontWeight: 700, flexShrink: 0 }}>→</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{ background: "#FFFFFF", padding: "112px 0" }}
          aria-labelledby="alert-heading"
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 64,
                alignItems: "center",
              }}
              className="responsive-2col"
            >
              <div>
                <p className="label reveal" style={{ marginBottom: 16 }}>Predict Before It Builds</p>
                <h2
                  id="alert-heading"
                  className="reveal reveal-d1"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.25rem, 3vw, 3rem)",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    color: "#172033",
                    letterSpacing: "-0.01em",
                    marginBottom: 20,
                  }}
                >
                  From a warning
                  <br />
                  <span style={{ color: "#667085" }}>to a decision.</span>
                </h2>
                <p
                  className="reveal reveal-d2"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.0625rem",
                    lineHeight: 1.72,
                    color: "#667085",
                    marginBottom: 32,
                  }}
                >
                  SmartFlow doesn&apos;t stop at showing a red zone. It connects the
                  signal directly to an operational response — giving your team a
                  clear action before the situation becomes a disruption.
                </p>

                <div
                  className="reveal reveal-d3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    alignItems: "flex-start",
                    maxWidth: 260,
                  }}
                >
                  {[
                    { label: "Main Stage",    note: "Crowd movement detected", accent: false },
                    { label: "Food Court",    note: "94% — Critical",          accent: true  },
                    { label: "Food Court B",  note: "Redirect route",          accent: false },
                    { label: "Staff deploy",  note: "2 at junction",           accent: false },
                  ].map((node, i) => (
                    <div key={node.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                      <div
                        className={node.accent ? "flow-node flow-node-blue" : "flow-node"}
                        style={{ width: "100%" }}
                      >
                        <span style={{ fontWeight: 600 }}>{node.label}</span>
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: "0.75rem",
                            color: node.accent ? "#2563EB" : "#98A2B3",
                            fontWeight: 400,
                          }}
                        >
                          {node.note}
                        </span>
                      </div>
                      {i < 3 && (
                        <div
                          aria-hidden="true"
                          style={{
                            width: 1,
                            height: 20,
                            background: "#E4E7EC",
                            marginLeft: 28,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="alert-panel reveal reveal-d1">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        letterSpacing: "0.09em",
                        textTransform: "uppercase",
                        color: "#98A2B3",
                        marginBottom: 4,
                      }}
                    >
                      Food Court
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "2.25rem",
                        fontWeight: 700,
                        color: "#DC2626",
                        lineHeight: 1,
                      }}
                    >
                      94<span style={{ fontSize: "1.25rem", fontWeight: 500 }}>%</span>
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.8125rem",
                        color: "#667085",
                        marginTop: 2,
                      }}
                    >
                      Occupied
                    </p>
                  </div>
                  <span className="badge badge-crit" style={{ alignSelf: "flex-start" }}>
                    <span className="status-dot dot-live" />
                    Critical
                  </span>
                </div>

                <div
                  style={{
                    background: "rgba(220,38,38,0.06)",
                    border: "1px solid rgba(220,38,38,0.12)",
                    borderRadius: 8,
                    padding: "14px 16px",
                    marginBottom: 20,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.875rem",
                      lineHeight: 1.55,
                      color: "#374151",
                    }}
                  >
                    Critical capacity predicted in approximately{" "}
                    <strong style={{ color: "#DC2626" }}>4 minutes</strong>.
                  </p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: "94%", background: "#DC2626" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 5,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#98A2B3" }}>
                      0%
                    </span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#DC2626", fontWeight: 600 }}>
                      94%
                    </span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#98A2B3" }}>
                      100%
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(37,99,235,0.12)", marginBottom: 20 }} />

                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "#98A2B3",
                    marginBottom: 12,
                  }}
                >
                  Recommended Action
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    "Redirect attendees to Food Court B",
                    "Deploy 2 staff members to the junction",
                  ].map((action) => (
                    <li
                      key={action}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 14px",
                        background: "#FFFFFF",
                        border: "1px solid rgba(37,99,235,0.14)",
                        borderRadius: 7,
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.875rem",
                        color: "#374151",
                      }}
                    >
                      <span
                        style={{
                          color: "#2563EB",
                          fontWeight: 700,
                          lineHeight: 1.4,
                          flexShrink: 0,
                        }}
                      >
                        →
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{ background: "#F8F7F3", padding: "112px 0" }}
          aria-labelledby="coord-heading"
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
            <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 72px" }}>
              <h2
                id="coord-heading"
                className="reveal"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.25rem, 3.5vw, 3rem)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: "#172033",
                  letterSpacing: "-0.01em",
                }}
              >
                The right people.
                <br />
                In the right place.
                <br />
                <span style={{ color: "#667085" }}>At the right time.</span>
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
              className="responsive-2col"
            >
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E4E7EC",
                  borderRadius: 12,
                  padding: "40px",
                }}
                className="reveal"
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#2563EB",
                    marginBottom: 14,
                  }}
                >
                  Attendee Movement
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#172033",
                    marginBottom: 12,
                    lineHeight: 1.35,
                  }}
                >
                  Guide people toward less crowded areas.
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.68,
                    color: "#667085",
                    marginBottom: 32,
                  }}
                >
                  Recommend alternative routes and less congested zones before
                  pressure builds — reducing stress on high-occupancy areas
                  without requiring manual intervention.
                </p>

                <div
                  style={{
                    background: "#F8F7F3",
                    borderRadius: 8,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    alignItems: "flex-start",
                  }}
                  aria-label="Crowd movement flow: Food Court to Food Court B"
                >
                  {[
                    { text: "Food Court  →  94%",   highlight: true  },
                    { text: "Food Court B  →  38%",  highlight: false },
                  ].map((item, i) => (
                    <div key={i} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          background: item.highlight ? "#FEF2F2" : "#FFFFFF",
                          border: `1px solid ${item.highlight ? "rgba(220,38,38,0.15)" : "#E4E7EC"}`,
                          borderRadius: 7,
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: item.highlight ? "#DC2626" : "#172033",
                        }}
                      >
                        {item.text}
                        {item.highlight && (
                          <span className="badge badge-crit">Critical</span>
                        )}
                        {!item.highlight && (
                          <span className="badge badge-ok">Open</span>
                        )}
                      </div>
                      {i === 0 && (
                        <div
                          aria-hidden="true"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "5px 0",
                          }}
                        >
                          <div style={{ width: 1, height: 14, background: "#2563EB", opacity: 0.3 }} />
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M0 0 L5 6 L10 0" fill="rgba(37,99,235,0.4)" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                  <p
                    style={{
                      marginTop: 14,
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.75rem",
                      color: "#2563EB",
                      fontWeight: 500,
                    }}
                  >
                    Redirect recommended
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E4E7EC",
                  borderRadius: 12,
                  padding: "40px",
                }}
                className="reveal reveal-d1"
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#2563EB",
                    marginBottom: 14,
                  }}
                >
                  Staff Deployment
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#172033",
                    marginBottom: 12,
                    lineHeight: 1.35,
                  }}
                >
                  A clear view of where support is needed.
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.68,
                    color: "#667085",
                    marginBottom: 32,
                  }}
                >
                  Give operations teams a real-time picture of resource
                  distribution, so deployment decisions are based on data
                  rather than radio calls and guesswork.
                </p>

                <div
                  style={{
                    background: "#F8F7F3",
                    borderRadius: 8,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                  aria-label="Staff deployment overview"
                >
                  {[
                    { zone: "Food Court",  deployed: 8, total: 8,  urgent: true  },
                    { zone: "Main Stage",  deployed: 14, total: 16, urgent: false },
                    { zone: "Gate A",      deployed: 10, total: 12, urgent: false },
                    { zone: "Activity",    deployed: 10, total: 14, urgent: false },
                  ].map((row) => (
                    <div
                      key={row.zone}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 14px",
                        background: "#FFFFFF",
                        border: `1px solid ${row.urgent ? "rgba(220,38,38,0.15)" : "#E4E7EC"}`,
                        borderRadius: 7,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.8125rem",
                          fontWeight: 500,
                          color: "#172033",
                        }}
                      >
                        {row.zone}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.8125rem",
                            color: "#667085",
                          }}
                        >
                          {row.deployed}/{row.total} staff
                        </span>
                        {row.urgent && (
                          <span className="badge badge-crit">Full</span>
                        )}
                        {!row.urgent && (
                          <span className="badge badge-ok">
                            {row.total - row.deployed} avail.
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          style={{ background: "#FFFFFF", padding: "112px 0" }}
          aria-labelledby="hiw-heading"
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
            <div style={{ maxWidth: 560, marginBottom: 72 }}>
              <p className="label reveal" style={{ marginBottom: 16 }}>How SmartFlow Works</p>
              <h2
                id="hiw-heading"
                className="reveal reveal-d1"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.25rem, 3.5vw, 3rem)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: "#172033",
                  letterSpacing: "-0.01em",
                }}
              >
                From live signals
                <br />
                <span style={{ color: "#667085" }}>to coordinated action.</span>
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 0,
                borderTop: "1px solid #E4E7EC",
              }}
              className="responsive-4col"
            >
              {[
                {
                  n: "01",
                  label: "Collect",
                  body: "Live occupancy and movement data is captured across every zone at the event.",
                },
                {
                  n: "02",
                  label: "Analyze",
                  body: "Zone-level patterns are identified: where people are, how they're moving, and where pressure is building.",
                },
                {
                  n: "03",
                  label: "Predict",
                  body: "Emerging congestion is flagged before it reaches critical levels, giving teams time to act.",
                },
                {
                  n: "04",
                  label: "Respond",
                  body: "Operations teams receive clear alerts and recommended actions — attendee guidance, staff deployment, route changes.",
                },
              ].map((step, i) => (
                <div
                  key={step.n}
                  className={`reveal reveal-d${i + 1} hiw-step-border`}
                  style={{
                    padding: "44px 32px 44px",
                    borderRight: i < 3 ? "1px solid #E4E7EC" : "none",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#2563EB",
                      marginBottom: 16,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {step.n}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1.1875rem",
                      fontWeight: 600,
                      color: "#172033",
                      marginBottom: 12,
                    }}
                  >
                    {step.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.68,
                      color: "#667085",
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          style={{ background: "#F2F1EC", padding: "112px 0" }}
          aria-labelledby="features-heading"
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
            <div style={{ maxWidth: 560, marginBottom: 64 }}>
              <h2
                id="features-heading"
                className="reveal"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.25rem, 3.5vw, 3rem)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: "#172033",
                  letterSpacing: "-0.01em",
                }}
              >
                Everything your
                operations team
                <br />
                <span style={{ color: "#667085" }}>needs to stay ahead.</span>
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
              className="responsive-3col"
            >
              {features.map((feat, i) => (
                <div
                  key={feat.title}
                  className={`feature-card reveal reveal-d${(i % 3) + 1}`}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 9,
                      background: "#EEF4FF",
                      border: "1px solid rgba(37,99,235,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                    }}
                    aria-hidden="true"
                  >
                    {feat.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1.0625rem",
                      fontWeight: 600,
                      color: "#172033",
                      marginBottom: 10,
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.65,
                      color: "#667085",
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{ background: "#F8F7F3", padding: "128px 0 120px" }}
          aria-labelledby="cta-heading"
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 32px",
              textAlign: "center",
            }}
          >
            <p className="label reveal" style={{ marginBottom: 20 }}>Smarter Event Operations</p>
            <h2
              id="cta-heading"
              className="reveal reveal-d1"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.75rem, 5vw, 4.5rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "#172033",
                letterSpacing: "-0.01em",
                marginBottom: 24,
              }}
            >
              Know what&apos;s happening.
              <br />
              <span style={{ color: "#2563EB" }}>Know what&apos;s next.</span>
            </h2>
            <p
              className="reveal reveal-d2"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.125rem",
                lineHeight: 1.72,
                color: "#667085",
                maxWidth: 500,
                margin: "0 auto 40px",
              }}
            >
              Give your operations team the visibility to respond before
              congestion becomes disruption.
            </p>
            <div
              className="reveal reveal-d3"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <a href="#dashboard" className="btn btn-blue">
                Open Operations Dashboard
                <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </section>

        <footer
          style={{
            background: "#F2F1EC",
            borderTop: "1px solid #E4E7EC",
            padding: "48px 0",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 32px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 40,
            }}
          >
            <div style={{ maxWidth: 260 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "rgba(37,99,235,0.09)",
                    border: "1px solid rgba(37,99,235,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <rect x="0.5" y="0.5" width="5.5" height="5.5" rx="1.2"
                      fill="#2563EB" fillOpacity="0.9" />
                    <rect x="8"    y="0.5" width="5.5" height="5.5" rx="1.2"
                      fill="#2563EB" fillOpacity="0.45" />
                    <rect x="0.5"  y="8"   width="5.5" height="5.5" rx="1.2"
                      fill="#2563EB" fillOpacity="0.45" />
                    <rect x="8"    y="8"   width="5.5" height="5.5" rx="1.2"
                      fill="#2563EB" fillOpacity="0.9" />
                  </svg>
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#172033",
                  }}
                >
                  SmartFlow
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  color: "#98A2B3",
                }}
              >
                Smart event operations,
                <br />
                built around the movement of people.
              </p>
            </div>

            <nav aria-label="Footer navigation">
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px 32px",
                }}
              >
                {["Overview", "How It Works", "Dashboard", "Features"].map((l) => (
                  <li key={l}>
                    <a
                      href={`#${l.toLowerCase().replace(" ", "-")}`}
                      className="footer-link"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                color: "#98A2B3",
                alignSelf: "flex-end",
              }}
            >
              © 2026 SmartFlow
            </p>
          </div>
        </footer>

      </main>
    </>
=======
    <div className="venuro-rise">
      {/* Brand header (mobile shows it; desktop uses the top nav) */}
      <header className="sticky top-0 z-30 border-b border-border bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-brand">
            V
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight tracking-tight">Venuro</p>
            <p className="text-[11px] leading-tight text-muted">Your event companion</p>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-4 lg:pt-6">
        {/* Event hero */}
        <div className="brand-hero relative overflow-hidden rounded-3xl p-5">
          {/* decorative glow blobs */}
          <span className="hero-glow -right-6 -top-10 h-28 w-28 bg-white/20" />
          <span className="hero-glow bottom-[-30px] left-10 h-24 w-24 bg-white/10" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/90 ring-1 ring-white/20">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              Live now
            </span>
            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight">
              {eventInfo.name}
            </h2>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <PinIcon width={14} height={14} /> {eventInfo.venue}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon width={14} height={14} /> {eventInfo.dateLabel}
              </span>
            </div>
            <div className="mt-4 inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
              {eventInfo.weather}
            </div>
          </div>
        </div>

        {/* Quick entries with soft color accents */}
        <div className="grid grid-cols-2 gap-3.5">
          <Link href="/map" className="group">
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-soft transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-card">
              <span className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-blue-50" />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                <MapIcon width={21} height={21} />
              </span>
              <p className="relative mt-3 text-[15px] font-semibold">Venue Map</p>
              <p className="relative text-[11px] text-muted">Stages, exits & zones</p>
            </div>
          </Link>
          <Link href="/facilities" className="group">
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-soft transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-card">
              <span className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-violet-50" />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-sm">
                <FacilitiesIcon width={21} height={21} />
              </span>
              <p className="relative mt-3 text-[15px] font-semibold">Facilities</p>
              <p className="relative text-[11px] text-muted">Food, restrooms & more</p>
            </div>
          </Link>
        </div>

        {/* Live crowd levels */}
        <section>
          <SectionTitle
            title="Live crowd levels"
            action={
              <Link href="/map" className="text-xs font-semibold text-blue-600">
                View map
              </Link>
            }
          />
          <div className="space-y-3">
            {busiest.map((zone) => (
              <Link key={zone.id} href={`/map?zone=${zone.id}`}>
                <Card interactive>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{zone.name}</p>
                      <p className="text-[11px] text-muted">{zone.category}</p>
                    </div>
                    <CrowdBadge level={zone.crowd} />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <CapacityBar value={zone.capacity} />
                    <span className="w-9 shrink-0 text-right text-[11px] font-semibold text-muted">
                      {zone.capacity}%
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Event updates — timeline style, less boxy */}
        <section>
          <SectionTitle title="Event updates" />
          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <ol className="relative space-y-4 pl-4">
              {/* vertical timeline line */}
              <span className="absolute bottom-2 left-[5px] top-2 w-px bg-border" />
              {eventUpdates.map((u) => (
                <li key={u.id} className="relative">
                  <span
                    className={`absolute -left-4 top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${
                      u.kind === "alert"
                        ? "bg-rose-500"
                        : u.kind === "schedule"
                          ? "bg-blue-600"
                          : "bg-slate-300"
                    }`}
                  />
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold">{u.title}</p>
                    <span className="shrink-0 text-[11px] text-muted">{u.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{u.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Facilities entry banner */}
        <Link href="/facilities" className="group block">
          <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-violet-50 p-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-card">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <FacilitiesIcon width={20} height={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Find facilities nearby</p>
              <p className="text-xs text-muted">Food, restrooms, water, Wi-Fi and more</p>
            </div>
            <ChevronRightIcon width={18} height={18} className="shrink-0 text-blue-500" />
          </div>
        </Link>
      </div>
    </div>
>>>>>>> Stashed changes
  );
}
