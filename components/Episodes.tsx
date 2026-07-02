import type { Episode } from "@/lib/youtube";

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Episodes({ episodes }: { episodes: Episode[] }) {
  if (!episodes.length) {
    return <p className="text-sm text-muted">No episodes yet.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-line">
      {episodes.map((episode) => (
        <li key={episode.link} className="py-4 first:pt-0">
          <a
            href={episode.link}
            target="_blank"
            rel="noreferrer"
            className="group block"
          >
            <span className="block font-serif text-lg leading-snug text-ink transition-colors group-hover:text-terracotta">
              {episode.title}
            </span>
            {episode.date && (
              <span className="mt-1 block text-xs text-muted">
                {formatDate(episode.date)}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
