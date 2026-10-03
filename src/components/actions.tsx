import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { ChevronRight, MapPin } from "lucide-react";
import type { CookFilter } from "@/lib/cafe";
import type { ReactNode } from "react";

const base =
  "press inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill px-3.5 py-2.5 font-display text-ui uppercase";

export function OrderLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={clsx(base, "bg-rowdy text-bone")} href={href} target="_blank" rel="noreferrer">
      {children}
      <ChevronRight className="size-4" aria-hidden="true" />
    </a>
  );
}

export function GhostLink({
  to,
  hash,
  search,
  children,
  pin = false,
}: {
  to: "/menu" | "/find-us" | "/story" | "/";
  hash?: string;
  search?: { cook: CookFilter };
  children: ReactNode;
  pin?: boolean;
}) {
  return (
    <Link
      to={to}
      hash={hash}
      search={search}
      className={clsx(base, "border border-bone bg-transparent text-bone")}
    >
      {pin ? <MapPin className="size-4" aria-hidden="true" /> : null}
      {children}
      {pin ? null : <ChevronRight className="size-4" aria-hidden="true" />}
    </Link>
  );
}

export function MapLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={clsx(base, "border border-bone bg-transparent text-bone")} href={href} target="_blank" rel="noreferrer">
      <MapPin className="size-4" aria-hidden="true" />
      {children}
    </a>
  );
}
