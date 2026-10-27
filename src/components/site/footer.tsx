import Image from "next/image";
import Link from "next/link";
import type { Content } from "@/content/types";

export function Footer({ lang, content }: { lang: string; content: Content }) {
  const { company, nav } = content;
  return (
    <footer className="bg-night text-[var(--on-night)]">
      <div className="frame grid gap-14 pb-7 pt-16 md:gap-28 md:pt-28">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="grid gap-5 md:col-span-7">
            <Image src="/images/logo-white.png" alt="Vision Blend" width={900} height={180} className="h-auto w-full max-w-[560px]" />
            <p className="text-[var(--on-night-muted)]">{company.tagline} Since {company.founded}.</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-2.5 md:col-span-4 md:col-start-9">
            {nav.map((item) => (
              <Link key={item.href} href={`/${lang}${item.href}`} className="u justify-self-start">
                {item.label}
              </Link>
            ))}
            <a className="u justify-self-start" href={company.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[0.78rem] text-[var(--on-night-muted)]">
          <span>&copy; {company.legalName}, since {company.founded}</span>
          <span>{company.instagramHandle}</span>
        </div>
      </div>
    </footer>
  );
}
