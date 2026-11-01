import Image from "next/image";
import type { Member } from "@/content/types";

/**
 * The team, name and role. Portraits show only once every member has one (uploaded in the admin),
 * so the grid is either all photos or all type, never a mix with empty frames.
 */
export function TeamList({ members }: { members: Member[] }) {
  const withPhotos = members.length > 0 && members.every((m) => m.photo);

  if (withPhotos) {
    return (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {members.map((m) => (
          <li key={m.name} className="group grid content-start gap-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-night">
              <Image
                src={m.photo!}
                alt={m.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.03]"
              />
            </div>
            <span className="grid gap-0.5">
              <span className="text-[1.08rem]">{m.name}</span>
              <span className="text-[0.92rem] text-muted-foreground">{m.role}</span>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m, i) => (
        <li key={m.name} className="group grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-b border-border py-5">
          <span className="pt-1.5 text-[0.78rem] font-medium text-[var(--faint)] transition-colors group-hover:text-brand">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="grid gap-0.5">
            <span className="t-h3">{m.name}</span>
            <span className="text-[0.95rem] text-muted-foreground">{m.role}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
