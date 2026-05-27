import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { NavLink } from "./nav-link";

export default function Header() {
  const links = [
    { href: "/challenges", label: "Desafios" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/30 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-5">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-serif text-lg font-bold tracking-wide text-foreground hover:opacity-85 transition-opacity select-none"
        >
          道 PATH
        </Link>
        {/* Thin vertical divider */}
        <div className="h-4 w-[1px] bg-border/40" />
        {/* Navigation Links */}
        <nav className="flex items-center gap-6 font-mono text-[13px] tracking-wide select-none">
          {links.map(({ href, label }) => (
            <NavLink key={href} href={href}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

