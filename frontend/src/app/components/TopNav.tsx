"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { HomeIcon, MapIcon, FacilitiesIcon } from "./icons";

interface NavItem {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const items: NavItem[] = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/map", label: "Map", Icon: MapIcon },
  { href: "/facilities", label: "Facilities", Icon: FacilitiesIcon },
];

/** Desktop-only top navigation bar with a centered set of links. */
export default function TopNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-card/90 backdrop-blur lg:block">
      <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
        {/* Brand on the left */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-brand">
            V
          </span>
          <span className="text-base font-bold tracking-tight">Venuro</span>
        </Link>

        {/* Centered nav links */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <ul className="flex items-center gap-1">
            {items.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-muted hover:bg-blue-50/60 hover:text-foreground"
                    }`}
                  >
                    <Icon width={18} height={18} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
