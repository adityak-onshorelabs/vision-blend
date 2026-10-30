/*
  Home hero on the full-screen copper key visual. Intro: the copper fades up from dark while the
  white wordmark wipes in and its full stop pings, then the wordmark lifts away and the tagline
  rises in word by word. It plays on every load of the home page,
  including client-side navigation back to it. All motion is CSS keyframes, so it starts on
  first paint; HeroMotion ends it (or skips it on any input), and the global reduced-motion rule
  turns it off. Base styles are the final state, so no-JS and animation-free renders show the
  finished hero.
*/
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import type { CSSProperties } from "react";
import type { Content } from "@/content/types";
import { HeroMotion } from "./hero-motion";

type Props = {
  lang: string;
  tagline: string;
  copy: Content["home"];
  services: { slug: string; name: string }[];
  labels: { startProject: string; seeWork: string };
};

export function Hero({ lang, tagline, copy, services, labels }: Props) {
  // The full stop is drawn as the brand dot, so drop a trailing period from the copy
  const words = tagline.replace(/\.$/, "").split(" ");

  return (
    <section data-hero aria-labelledby="hero-title" className="hero">
      <HeroMotion />

      <div className="hero-stage band-dark">
        <div className="hero-bg" aria-hidden="true">
          <Image src="/images/hero-copper.jpg" alt="" fill priority quality={90} sizes="100vw" className="hero-blend-a object-cover" />
        </div>
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-scrim" aria-hidden="true" />

        <div className="frame hero-content">
          <div className="hero-center">
            <p className="t-label hero-fade !text-brand" style={{ "--i": 0 } as CSSProperties}>
              {copy.eyebrow}
            </p>

            <h1 id="hero-title" className="t-hero">
              {words.map((w, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  {/* the last word ("taste") is the highlighted key word, in the brand brown */}
                  <span className={i === words.length - 1 ? "hero-word text-brand" : "hero-word"}>
                    <span style={{ "--i": i } as CSSProperties}>{w}</span>
                  </span>
                </Fragment>
              ))}
              <span className="hero-stop" aria-hidden="true" />
            </h1>

            <p className="t-lead hero-fade" style={{ "--i": 1 } as CSSProperties}>
              {copy.lead}
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 hero-fade" style={{ "--i": 2 } as CSSProperties}>
              <Link href={`/${lang}/contact`} className="cta">
                {labels.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
              </Link>
              <Link href={`/${lang}/work`} className="cta cta-line">
                {labels.seeWork} <span className="arr" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="hero-foot hero-fade" style={{ "--i": 3 } as CSSProperties}>
            <ul className="hero-services">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${lang}/services#${s.slug}`} className="u">{s.name}</Link>
                </li>
              ))}
              <li>
                <a href="#reel-title" className="u">{copy.showreel.label}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="hero-intro" aria-hidden="true">
        <Image src="/images/logo-white.png" alt="" width={900} height={180} priority className="hero-intro-logo" />
      </div>
    </section>
  );
}
