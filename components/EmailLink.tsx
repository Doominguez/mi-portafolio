"use client";

import { useState, type AnchorHTMLAttributes, type KeyboardEvent, type MouseEvent } from "react";
import { getMailtoHref } from "@/lib/email";

type EmailLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export default function EmailLink({
  children,
  className,
  onClick,
  ...rest
}: EmailLinkProps) {
  const [href, setHref] = useState<string | undefined>(undefined);

  const activate = () => {
    setHref(getMailtoHref());
    window.location.href = getMailtoHref();
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    activate();
    onClick?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  };

  return (
    <a
      {...rest}
      href={href}
      role="link"
      tabIndex={0}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </a>
  );
}
