import Image from "next/image";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";
import { ProjectArt } from "./project-art";

/** A project's uploaded still (from the admin) filling its box, or its line drawing until there is one. */
export function ProjectVisual({ project, label, artClassName, sizes = "(min-width: 1024px) 30vw, 90vw" }: { project: Project; label: string; artClassName?: string; sizes?: string }) {
  if (project.cover) {
    return <Image src={project.cover} alt={label} fill sizes={sizes} className="object-cover" />;
  }
  return <ProjectArt slug={project.slug} className={cn(artClassName)} label={label} />;
}
