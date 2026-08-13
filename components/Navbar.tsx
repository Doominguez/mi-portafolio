"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "Proyectos", href: "#proyectos" },
  { label: "Habilidades", href: "#habilidades" },
  { label: "Educación", href: "#educacion" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // El navbar del portfolio no aplica en el panel de administración.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent"
        }`}
    >
      <div className="container-portfolio flex justify-between items-center h-16">
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center shrink-0"
          data-vt-logo
          style={{ viewTransitionName: "logo" }}
          aria-label="Volver al inicio"
        >
          <img src="/logo-claro.png" alt="JDM" className="h-14 w-auto object-contain hidden dark:block" />
          <img src="/logo-oscuro.png" alt="JDM" className="h-14 w-auto object-contain block dark:hidden" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-sm font-medium">
            {links.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <li key={link.href} className="relative py-1">
                  <a
                    href={link.href}
                    className={`group relative py-1 text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? "text-[var(--accent-text)]"
                        : "text-[var(--text-2)] hover:text-[var(--text)]"
                    }`}
                  >
                    {link.label}

                    {/* Active section animated underline */}
                    {isActive ? (
                      <motion.span
                        layoutId="activeNavbarUnderline"
                        className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full bg-[var(--accent)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    ) : (
                      /* Hover underline transition */
                      <span className="absolute -bottom-1 left-0 w-0 h-[2.5px] rounded-full bg-[var(--accent)]/60 group-hover:w-full transition-all duration-250 ease-out" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="w-px h-6 bg-[var(--border)]" />
          <ThemeToggle />
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="flex md:hidden items-center gap-1.5">
          <ThemeToggle className="p-3" />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-3 rounded-md"
            aria-label="Menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-[var(--text)]" />
            ) : (
              <Menu className="w-5 h-5 text-[var(--text)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container-portfolio py-4 flex flex-col gap-2">
              {links.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`relative text-base font-semibold transition-colors py-2.5 px-3 rounded-lg flex items-center justify-between ${
                      isActive
                        ? "text-[var(--accent-text)] bg-[var(--accent)]/10"
                        : "text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--bg-2)]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    )}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
