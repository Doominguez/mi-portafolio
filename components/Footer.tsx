"use client";

import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import EmailLink from "./EmailLink";

export default function Footer() {
  const pathname = usePathname();

  // El footer del portfolio no aplica en el panel de administración.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="py-10 border-t border-[var(--border)]">
      <div className="container-portfolio flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="shrink-0">
          <img
            src="/logo-claro.png"
            alt="JDM"
            className="h-12 w-auto object-contain hidden dark:block"
          />
          <img
            src="/logo-oscuro.png"
            alt="JDM"
            className="h-12 w-auto object-contain block dark:hidden"
          />
        </div>

        <div className="flex items-center gap-5">
          <EmailLink className="flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--text)] transition-colors">
            <Mail className="w-4 h-4" />
            Email
          </EmailLink>
          <a
            href="https://github.com/doominguez"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/juniordominguez/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
            LinkedIn
          </a>
        </div>

        <div className="text-xs text-[var(--text-2)]">
          &copy; {new Date().getFullYear()} Junior Dominguez Montero
        </div>
      </div>
    </footer>
  );
}
