"use client";

/*
  The site header. "Work with us" sits in the top bar after Industries (final changes, 12 Nov 2026):
  a dropdown with Careers and Partner with us on wide screens, and the same two links under a
  disclosure in the mobile menu. The footer keeps its own links to both.
*/
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { NavItem } from "@/content/types";
import { cn } from "@/lib/utils";

type Props = { lang: string; nav: NavItem[]; more: { label: string; items: NavItem[] }; cta: string };

export function Header({ lang, nav, more, cta }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // On a page with a night hero the header sits over it, transparent, until the hero scrolls away
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      // Next keeps left pages in the DOM (hidden), so take the hero that is actually showing
      const hero = Array.from(document.querySelectorAll<HTMLElement>("[data-hero]")).find((el) => el.offsetHeight > 0);
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

  // Home ("") is current only on the home page itself
  const isCurrent = (path: string) => pathname === `/${lang}${path}` || (path !== "" && pathname.startsWith(`/${lang}${path}/`));
  const moreCurrent = more.items.some((i) => isCurrent(i.href));
  // "Work with us" follows Industries (or ends the list if Industries is ever removed)
  const at = nav.findIndex((i) => i.href === "/industries");
  const split = at === -1 ? nav.length : at + 1;

  return (
    <header
      data-past={pastHero}
      data-top={!scrolled}
      data-open={open}
      className={cn(
        "site-header sticky top-0 z-30 border-b bg-transparent transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open ? "border-border" : "border-transparent",
      )}
    >
      <div className="frame flex h-[76px] items-center justify-between gap-5">
        <Link href={`/${lang}`} aria-label="Vision Blend, home" className="shrink-0">
          <Image src="/images/logo-brown.png" alt="Vision Blend" width={110} height={22} priority className="logo-day h-[22px] w-auto" />
          <Image src="/images/logo-white.png" alt="Vision Blend" width={110} height={22} priority className="logo-night h-[22px] w-auto" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 text-[0.95rem] md:flex">
          {nav.slice(0, split).map((item) => (
            <Link key={item.href} href={`/${lang}${item.href}`} className="u" aria-current={isCurrent(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
          <MoreMenu lang={lang} label={more.label} items={more.items} current={moreCurrent} isCurrent={isCurrent} />
          {nav.slice(split).map((item) => (
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
          {nav.slice(0, split).map((item) => (
            <MobileLink key={item.href} lang={lang} item={item} current={isCurrent(item.href)} onPick={() => setOpen(false)} />
          ))}
          {/* Open from the start when one of its pages is showing */}
          <MobileMore key={String(moreCurrent)} lang={lang} label={more.label} items={more.items} current={moreCurrent} isCurrent={isCurrent} onPick={() => setOpen(false)} />
          {nav.slice(split).map((item) => (
            <MobileLink key={item.href} lang={lang} item={item} current={isCurrent(item.href)} onPick={() => setOpen(false)} />
          ))}
        </nav>
      </div>
    </header>
  );
}

type MenuProps = { lang: string; label: string; items: NavItem[]; current: boolean; isCurrent: (path: string) => boolean };

/**
 * Wide screens: a disclosure button and its panel of links. A mouse opens it on hover; a click,
 * tap or Enter toggles it; Escape, a click outside or focus leaving it closes it.
 */
function MoreMenu({ lang, label, items, current, isCurrent }: MenuProps) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // A mouse has already opened it on hover, so its click keeps it open rather than closing it
  const onClick = (e: ReactMouseEvent) => setOpen((v) => ((e.nativeEvent as PointerEvent).pointerType === "mouse" ? true : !v));

  return (
    <div
      ref={wrap}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        ref={button}
        type="button"
        className="u inline-flex items-center gap-1.5"
        aria-expanded={open}
        aria-controls={id}
        data-current={current}
        onClick={onClick}
      >
        {label}
        <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" className={cn("transition-transform duration-300", open && "rotate-180")}>
          <path d="M2.5 4.5 L6 8 L9.5 4.5" />
        </svg>
      </button>
      {/* The top padding bridges the gap, so the pointer can travel down without closing it */}
      <div id={id} hidden={!open} className="absolute start-1/2 top-full z-10 -translate-x-1/2 pt-4 rtl:translate-x-1/2">
        <ul className="grid w-[300px] border border-border bg-paper p-2 text-ink shadow-[0_16px_40px_oklch(0.13_0.006_40/0.16)]">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={`/${lang}${item.href}`}
                onClick={() => setOpen(false)}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className="group grid gap-0.5 px-4 py-3 transition-colors hover:bg-[var(--well)] focus-visible:bg-[var(--well)] aria-[current=page]:text-brand"
              >
                <span className="flex items-center justify-between gap-3 text-[0.98rem]">
                  {item.label}
                  <span aria-hidden="true" className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
                {item.text && <span className="text-[0.86rem] text-muted-foreground">{item.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileLink({ lang, item, current, onPick }: { lang: string; item: NavItem; current: boolean; onPick: () => void }) {
  return (
    <Link
      href={`/${lang}${item.href}`}
      onClick={onPick}
      aria-current={current ? "page" : undefined}
      className="t-h3 flex min-h-14 items-center justify-between border-b border-border aria-[current=page]:text-brand"
    >
      {item.label}
      <span aria-hidden="true" className="text-base text-muted-foreground">&rarr;</span>
    </Link>
  );
}

/** The mobile menu's "Work with us": a row that opens its two links beneath it */
function MobileMore({ lang, label, items, current, isCurrent, onPick }: MenuProps & { onPick: () => void }) {
  const [open, setOpen] = useState(current);
  const id = useId();
  return (
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn("t-h3 flex min-h-14 w-full items-center justify-between text-start", current && "text-brand")}
      >
        {label}
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" className={cn("text-muted-foreground transition-transform duration-300", open && "rotate-180")}>
          <path d="M2.5 4.5 L6 8 L9.5 4.5" />
        </svg>
      </button>
      <ul id={id} hidden={!open} className="grid gap-1 pb-4 ps-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={`/${lang}${item.href}`}
              onClick={onPick}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className="grid min-h-12 content-center gap-0.5 border-s border-border ps-4 aria-[current=page]:border-brand aria-[current=page]:text-brand"
            >
              <span className="text-[1.05rem]">{item.label}</span>
              {item.text && <span className="text-[0.86rem] text-muted-foreground">{item.text}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
