"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Hero is ~90–100vh; over the video we want text in white
  const [overHero, setOverHero] = useState(true);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const heroHeight = window.innerHeight * 0.85;
    setScrolled(y > 48);
    setOverHero(y < heroHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Colors switch based on whether we're over the dark video or the light page
  const textColor   = overHero ? "rgba(255,255,255,0.92)" : "#374151";
  const textHover   = overHero ? "#ffffff" : "#172033";
  const textMuted   = overHero ? "rgba(255,255,255,0.65)" : "#667085";
  const logoColor   = overHero ? "#ffffff" : "#172033";

  const navLinks = [
    { label: "Overview",       href: "#overview" },
    { label: "How It Works",   href: "#how-it-works" },
    { label: "Live Dashboard", href: "#dashboard" },
    { label: "Features",       href: "#features" },
  ];

  // Bar background when scrolled
  const barBg = scrolled
    ? overHero
      ? "rgba(7, 21, 47, 0.88)"        // dark tint over hero when scrolled
      : "rgba(248, 247, 243, 0.94)"     // ivory over light sections
    : "transparent";

  const barBorder = scrolled
    ? overHero
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid #E4E7EC"
    : "none";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s",
        background: barBg,
        borderBottom: barBorder,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          aria-label="SmartFlow home"
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: overHero
                ? "rgba(255,255,255,0.12)"
                : "rgba(37,99,235,0.09)",
              border: overHero
                ? "1px solid rgba(255,255,255,0.22)"
                : "1px solid rgba(37,99,235,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.3s, border-color 0.3s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0.5" y="0.5" width="5.5" height="5.5" rx="1.2"
                fill={overHero ? "rgba(255,255,255,0.9)" : "#2563EB"} fillOpacity="0.9" />
              <rect x="8"    y="0.5" width="5.5" height="5.5" rx="1.2"
                fill={overHero ? "rgba(255,255,255,0.9)" : "#2563EB"} fillOpacity="0.45" />
              <rect x="0.5"  y="8"   width="5.5" height="5.5" rx="1.2"
                fill={overHero ? "rgba(255,255,255,0.9)" : "#2563EB"} fillOpacity="0.45" />
              <rect x="8"    y="8"   width="5.5" height="5.5" rx="1.2"
                fill={overHero ? "rgba(255,255,255,0.9)" : "#2563EB"} fillOpacity="0.9" />
            </svg>
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              fontWeight: 600,
              color: logoColor,
              letterSpacing: "-0.01em",
              transition: "color 0.3s",
            }}
          >
            SmartFlow
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              listStyle: "none",
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  textColor={textColor}
                  textHover={textHover}
                  overHero={overHero}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
          <a
            href="#dashboard"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: textMuted,
              padding: "6px 14px",
              borderRadius: 6,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = textHover)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = textMuted)
            }
          >
            Live Demo
          </a>
          <a
            href="#dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              background: "#2563EB",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: 500,
              borderRadius: 6,
              transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#1D4ED8";
              el.style.transform = "translateY(-1px)";
              el.style.boxShadow = "0 4px 14px rgba(37,99,235,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#2563EB";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            Get Started
          </a>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            background: "none",
            border: "none",
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: textColor,
                borderRadius: 2,
                transition: "transform 0.25s, opacity 0.2s",
                transform: menuOpen
                  ? i === 0 ? "translateY(6.5px) rotate(45deg)"
                  : i === 2 ? "translateY(-6.5px) rotate(-45deg)"
                  : "none"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: menuOpen ? "360px" : 0,
          opacity: menuOpen ? 1 : 0,
          transition: "max-height 0.3s ease, opacity 0.25s ease",
          background: "rgba(248,247,243,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid #E4E7EC",
        }}
      >
        <div style={{ padding: "8px 24px 20px" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#374151",
                borderBottom: "1px solid #E4E7EC",
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ paddingTop: 16 }}>
            <a
              href="#dashboard"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                padding: "11px 0",
                background: "#2563EB",
                color: "#fff",
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                fontWeight: 500,
                borderRadius: 6,
              }}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Animated underline nav link ── */
function NavLink({
  href,
  children,
  textColor,
  textHover,
  overHero,
}: {
  href: string;
  children: React.ReactNode;
  textColor: string;
  textHover: string;
  overHero: boolean;
}) {
  const underlineColor = overHero ? "rgba(255,255,255,0.7)" : "#2563EB";
  return (
    <a
      href={href}
      style={{
        position: "relative",
        display: "inline-block",
        padding: "6px 13px",
        fontFamily: "var(--font-sans)",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: textColor,
        borderRadius: 6,
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = textHover;
        const line = e.currentTarget.querySelector<HTMLSpanElement>(".uline");
        if (line) line.style.transform = "scaleX(1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = textColor;
        const line = e.currentTarget.querySelector<HTMLSpanElement>(".uline");
        if (line) line.style.transform = "scaleX(0)";
      }}
    >
      {children}
      <span
        className="uline"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 3,
          left: 13,
          right: 13,
          height: 1,
          background: underlineColor,
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.22s ease",
        }}
      />
    </a>
  );
}
