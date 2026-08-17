import projectsData from "@/data/projects.json";

// Featured GitHub projects — a hand-curated list (data/projects.json), newest
// first. Each project is a full-width menu card that links to its repo: a serif
// title over a muted description. (The section header carries the GitHub link.)
type Project = {
  title: string;
  description: string;
  url: string;
};

const projects = projectsData as Project[];

export default function Projects() {
  if (!projects.length) return null;

  return (
    <ul className="flex flex-col gap-4">
      {projects.map((project) => (
        <li key={project.url} className="card">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-2.5 p-6 sm:p-7"
          >
            <span className="font-serif text-xl leading-snug text-ink transition-colors group-hover:text-terracotta">
              {project.title}
            </span>
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              {project.description}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
