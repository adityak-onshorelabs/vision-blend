import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { PageTransition } from "@/components/site/page-transition";
import { getContent } from "@/content";
import { hasLocale, localeDir, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const jost = Jost({ subsets: ["latin"], weight: "variable", variable: "--font-jost", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#F8F8F6", colorScheme: "light" };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = getContent(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: c.home.metaTitle, template: `%s | ${c.company.name}` },
    description: c.home.metaDescription,
    openGraph: {
      type: "website",
      siteName: c.company.name,
      title: c.home.metaTitle,
      description: c.home.metaDescription,
      // Link previews (WhatsApp, LinkedIn, iMessage): white wordmark on the copper gradient
      images: [{ url: "/images/og-copper.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "Vision Blend wordmark on the copper key visual" }],
    },
    twitter: { card: "summary_large_image", images: ["/images/og-copper.jpg"] },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getContent(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: c.company.legalName,
    url: siteUrl,
    logo: `${siteUrl}/images/logo-brown.png`,
    slogan: c.company.tagline,
    foundingDate: String(c.company.founded),
    sameAs: [c.company.instagram],
    knowsAbout: c.services.map((s) => s.name),
  };

  return (
    <html lang={lang} dir={localeDir[lang]} className={jost.variable} data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper">
          {c.ui.skip}
        </a>
        <Header lang={lang} nav={c.nav} cta={c.ui.startProject} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer lang={lang} content={c} />
        <PageTransition
          lang={lang}
          labels={{ home: c.company.name, work: "Work", services: "Services", about: "About", contact: c.ui.startProject }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
