import Link from "next/link";

export default function NotFound() {
  return (
    <section className="band" aria-labelledby="nf-title">
      <div className="frame grid gap-8 py-[var(--section)]">
        <span className="t-label marker">404</span>
        <h1 id="nf-title" className="t-h1 max-w-[14ch]">
          This page is not in the file<span className="stop">.</span>
        </h1>
        <p className="text-muted-foreground">The link may be old, or the page has moved.</p>
        <Link href="/en" className="cta justify-self-start">
          Back to the homepage <span className="arr" aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
