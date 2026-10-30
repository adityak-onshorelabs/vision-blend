"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem } from "@/content/types";
import { cn } from "@/lib/utils";

type Props = { lang: string; nav: NavItem[]; cta: string };

export function Header({ lang, nav, cta }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // On a page with a night hero the header sits over it, transparent, until the hero scrolls away
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setPastHero(!hero || window.scrollY > hero.offsetHeight - 77);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (path: string) => pathname === `/${lang}${path}` || pathname.startsWith(`/${lang}${path}/`);

  return (
    <header
      data-past={pastHero}
      data-top={!scrolled}
      data-open={open}
      className={cn(
        "site-header sticky top-0 z-30 border-b bg-paper transition-colors duration-300",
        scrolled || open ? "border-border" : "border-transparent",
      )}
    >
      <div className="frame flex h-[76px] items-center justify-between gap-5">
        <Link href={`/${lang}`} aria-label="Vision Blend, home" className="shrink-0">
          <Image src="/images/logo-brown.png" alt="Vision Blend" width={110} height={22} priority className="logo-day h-[22px] w-auto" />
          <Image src="/images/logo-white.png" alt="Vision Blend" width={110} height={22} priority className="logo-night h-[22px] w-auto" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 text-[0.95rem] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={`/${lang}${item.href}`} className="u" aria-current={isCurrent(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
          <Link href={`/${lang}/contact`} className="cta cta-sm">
            {cta} <span className="arr" aria-hidden="true">&rarr;</span>
          </Link>
        </nav>

        <button
          type="button"
          className="t-label flex min-h-11 items-center gap-3 !text-current md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span aria-hidden="true" className="relative block h-2.5 w-5">
            <span className={cn("absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300", open && "translate-y-[5px] rotate-45")} />
            <span className={cn("absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300", open && "-translate-y-[4px] -rotate-45")} />
          </span>
        </button>
      </div>

      <div id="mobile-nav" hidden={!open} className="border-t border-border md:hidden">
        <nav aria-label="Mobile" className="frame grid py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={`/${lang}${item.href}`}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className="t-h3 flex min-h-14 items-center justify-between border-b border-border aria-[current=page]:text-brand"
            >
              {item.label}
              <span aria-hidden="true" className="text-base text-muted-foreground">&rarr;</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
