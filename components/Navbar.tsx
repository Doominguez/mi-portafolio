"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
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
          <ul className="flex items-center gap-6 text-sm font-medium">
            {links.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-2)] hover:text-[var(--text)]"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="w-px h-6 bg-[var(--border)]" />

          <div className="flex items-center gap-1">
            <a
              href="https://github.com/doominguez"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-[var(--surface)] transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-[18px] h-[18px] text-[var(--text-2)] hover:text-[var(--text)]" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-[var(--surface)] transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-[18px] h-[18px] text-[var(--text-2)] hover:text-[var(--text)]" />
            </a>
            <div className="w-px h-4 bg-[var(--border)] mx-1" />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: social icons + toggle + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <a
            href="https://github.com/doominguez"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md"
            aria-label="GitHub"
          >
            <GithubIcon className="w-[18px] h-[18px] text-[var(--text-2)]" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-[18px] h-[18px] text-[var(--text-2)]" />
          </a>
          <div className="w-px h-4 bg-[var(--border)] mx-1" />
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md"
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
            className="md:hidden border-b border-[var(--border)] bg-[var(--bg)] overflow-hidden"
          >
            <div className="container-portfolio py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-[var(--text-2)] hover:text-[var(--text)] transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
