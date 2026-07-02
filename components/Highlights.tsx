import type { Highlight } from "@/lib/curius";

export default function Highlights({ highlights }: { highlights: Highlight[] }) {
  if (!highlights.length) {
    return <p className="text-sm text-muted">Nothing highlighted this week.</p>;
  }

  return (
    // One row on desktop — one column per note (up to 6). Stacks on smaller screens.
    <ul
      style={{ ["--cols" as string]: highlights.length }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
    >
      {highlights.map((item) => (
        <li key={item.url} className="card flex flex-col">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-1 flex-col justify-between gap-6 p-5"
          >
            <p className="font-serif text-base leading-snug text-ink transition-colors group-hover:text-terracotta">
              {item.text}
            </p>
            <p className="label border-t border-line pt-3">{item.author}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
