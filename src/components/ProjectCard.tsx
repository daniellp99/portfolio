import { Project } from "@/data/project-dto";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({
  project,
  isHorizontal,
}: {
  project: Project;
  isHorizontal: boolean;
}) {
  return (
    <div
      style={
        {
          "--image-url": `url(/${project.images[0].bg})`,
        } as React.CSSProperties
      }
      className={cn(
        "group h-full w-full overflow-hidden dark:bg-none",
        !!project.images[0].bg && "bg-[image:var(--image-url)] bg-cover",
      )}
    >
      <Image
        className={cn(
          "rounded-3xl shadow-2xl",
          isHorizontal
            ? "origin-top -rotate-[30deg]"
            : "origin-right -rotate-45",
        )}
        alt={project.images[0].alt}
        src={`/${project.images[0].image}`}
        width={800}
        height={800}
      />
      <Link
        href="#"
        className="cancelDrag absolute bottom-3 left-3 flex h-10 w-fit items-center overflow-hidden rounded-full border-2 bg-white p-2 transition-all  duration-300 ease-linear hover:scale-110 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <p className="max-w-0 -translate-x-full truncate pr-5 text-sm font-bold opacity-0 transition-all delay-75 duration-300 ease-linear group-hover:max-w-[116px] group-hover:translate-x-0 group-hover:opacity-100 group-hover:md:max-w-[152px] group-hover:lg:max-w-[252px]">
          {project.name}
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="absolute right-2 h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  );
}
