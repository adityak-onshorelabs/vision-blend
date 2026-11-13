import type { Member } from "@/content/types";
import { Portrait } from "./portrait";

/**
 * The core team: a 4:5 portrait per person (13 Nov 2026: reel-style frames, the same as the
 * leadership above), then name and role. Until a photo is uploaded in the admin, that person's
 * frame shows their initials, so the row keeps one rhythm while photos come in.
 */
export function TeamList({ members }: { members: Member[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5">
      {members.map((m) => (
        <li key={m.name} className="grid content-start gap-3">
          <Portrait name={m.name} photo={m.photo} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />
          <span className="grid gap-0.5">
            <span className="text-[1.08rem]">{m.name}</span>
            <span className="text-[0.92rem] text-muted-foreground">{m.role}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
