import Image from "next/image";

/*
  A person's portrait, a vertical 4:5 frame like a reel still (13 Nov 2026: replaces the round
  passport-size avatar on About, for leadership and the core team alike). Their photo when the
  studio has supplied one, else their initials on a warm tint in the same frame, so a row where
  only some photos are in still lines up.
*/

const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w) && !/^(Mr|Mrs|Ms|Dr)\.?$/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export function Portrait({ name, photo, sizes }: { name: string; photo?: string; sizes: string }) {
  return (
    <span className="group/portrait relative block aspect-[4/5] w-full overflow-hidden bg-[var(--well)]">
      {photo ? (
        <Image
          src={photo}
          alt={`Portrait of ${name}`}
          fill
          sizes={sizes}
          className="object-cover object-top transition-transform duration-[900ms] ease-[var(--ease)] group-hover/portrait:scale-[1.03]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_90%_at_30%_20%,oklch(0.94_0.025_60),oklch(0.85_0.05_50))] text-[clamp(1.6rem,3vw,2.4rem)] font-[340] tracking-[0.06em] text-[var(--brand)]"
        >
          {initials(name)}
        </span>
      )}
    </span>
  );
}
