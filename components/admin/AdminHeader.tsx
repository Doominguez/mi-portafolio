"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, Plus, LayoutGrid, ExternalLink } from "lucide-react";
import LogoutButton from "../LogoutButton";

const navLinks = [
  { label: "Proyectos", href: "/admin", icon: LayoutGrid },
  { label: "Nuevo proyecto", href: "/admin/nuevo", icon: Plus },
];

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
            <FolderKanban className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight">
            JDM<span className="text-[var(--accent)]">.admin</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--surface)] text-[var(--accent)]"
                    : "text-[var(--text-2)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-[var(--text-2)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)] sm:flex"
          >
            <ExternalLink className="h-4 w-4" />
            Ver sitio
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
