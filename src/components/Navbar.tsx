"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Map" },
  { href: "/report", label: "Report" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/insights", label: "AI Insights" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-light text-sm font-bold text-white shadow-md">
            RS
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-navy">RoadSafe</span>
            <span className="text-sm font-bold text-accent"> Intelligence</span>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Greater Toronto Area
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2.5 py-2 text-sm font-medium transition sm:px-3 ${
                  isActive
                    ? "bg-navy text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
