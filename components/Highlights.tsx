import type { Highlight } from "@/lib/curius";

// Slight tilts for a pinned-up look (all notes share one earthy yellow).
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-1", "-rotate-1"];

export default function Highlights({ highlights }: { highlights: Highlight[] }) {
  if (!highlights.length) {
    return <p className="text-muted">Nothing highlighted this week.</p>;
  }

  return (
    // One row on desktop — exactly as many columns as there are notes (up to 6),
    // so they fill the width and still read as post-its. Stacks on smaller screens.
    <ul
      style={{ ["--cols" as string]: highlights.length }}
      className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
    >
      {highlights.map((item, i) => (
        <li
          key={item.url}
          className={`postit ${TILTS[i % TILTS.length]} transition-transform hover:rotate-0`}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block hover:underline hover:underline-offset-4"
          >
            <span className="block text-sm leading-7">
              &ldquo;{item.text}&rdquo;
            </span>
            <span className="mt-1 block font-sans text-xs leading-7 text-ink/70">
              — {item.author}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
