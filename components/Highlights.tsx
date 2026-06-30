import highlights from "@/data/highlights.json";

type Highlight = {
  title: string;
  url: string;
  source: string;
  date: string;
};

// Slight tilts for a pinned-up look (all notes share one earthy yellow).
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-1"];

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function Highlights() {
  const items = (highlights as Highlight[]).slice(0, 5);

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item, i) => (
        <li
          key={item.url + item.title}
          className={`postit ${TILTS[i % TILTS.length]} transition-transform hover:rotate-0`}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block text-lg leading-7 hover:underline hover:underline-offset-4"
          >
            {item.title}
          </a>
          <p className="mt-1 font-sans text-xs leading-7 text-ink/70">
            {[item.source, formatDate(item.date)].filter(Boolean).join(" · ")}
          </p>
        </li>
      ))}
    </ul>
  );
}
