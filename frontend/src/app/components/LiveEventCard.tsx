"use client";

export default function LiveEventCard() {
  return (
    <a
      href="#dashboard"
      aria-label="Live event — 12,480 attendees, 68% occupancy, 3 zones need attention. View dashboard."
      className="live-event-card"
      style={{
        position: "absolute",
        bottom: 60,
        right: 52,
        zIndex: 4,
        display: "block",
        textDecoration: "none",
        /* base styles also in globals.css for the hover transition */
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.94)",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
          padding: "16px 20px",
          boxShadow: "0 4px 16px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.04)",
          minWidth: 220,
          maxWidth: 260,
        }}
      >
        {/* Label row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 10,
          }}
        >
          {/* Pulsing green dot */}
          <span
            className="live-dot"
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#16A34A",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.625rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#16A34A",
            }}
          >
            Live Event
          </span>
        </div>

        {/* Stats row */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "#172033",
            lineHeight: 1.45,
            marginBottom: 6,
          }}
        >
          12,480 attendees &middot; 68% occupancy
        </p>

        {/* Action row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "#2563EB",
            }}
          >
            3 zones need attention
          </span>
          <span
            className="card-arrow"
            aria-hidden="true"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "#2563EB",
              transition: "transform 0.2s ease",
            }}
          >
            →
          </span>
        </div>
      </div>
    </a>
  );
}
