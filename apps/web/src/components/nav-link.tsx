"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type ComponentProps } from "react";

interface NavLinkProps {
  href: ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const hrefString = typeof href === "string" ? href : href?.pathname || "";

  const isChallenges = hrefString === "/challenges";
  const isProfile = hrefString === "/profile";
  const isActive =
    pathname === hrefString ||
    pathname?.startsWith(hrefString + "/") ||
    (isChallenges && (pathname?.includes("/challenges") || pathname?.includes("/train"))) ||
    (isProfile && (pathname?.includes("/profile") || pathname === "/dashboard"));

  return (
    <Link
      href={href}
      className={`group relative py-2 px-1 font-mono text-[13px] tracking-wide transition-colors select-none ${
        isActive ? "text-foreground font-semibold" : "text-foreground/70 hover:text-foreground"
      }`}
    >
      {children}
      
      {/* Calligraphic underline line - grows outwards from the center only when active */}
      <span
        className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-red-700/80 rounded-full origin-center transition-all duration-300 ${
          isActive
            ? "scale-x-100 opacity-100 animate-ink-bleed"
            : "scale-x-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Calligraphic ink point dot - visible on hover or when active */}
      <span
        className={`absolute -bottom-[2px] left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-red-700/95 ring-2 ring-red-700/25 transition-all duration-300 ${
          isActive
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
        }`}
        aria-hidden="true"
      />
    </Link>
  );
}
