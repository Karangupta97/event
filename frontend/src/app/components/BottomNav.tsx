"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, MapIcon, FacilitiesIcon } from "./icons";
import type { ComponentType, SVGProps } from "react";

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

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-4 pb-4 lg:hidden"
    >
      <ul className="flex items-center justify-around rounded-full border border-border bg-white/90 px-2 py-1.5 shadow-pop backdrop-blur">
        {items.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Icon width={20} height={20} />
                <span className={active ? "inline" : "hidden"}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
