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
    return <p className="text-muted">No episodes yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-7">
      {episodes.map((episode) => (
        <li key={episode.link} className="bujo-bullet flex flex-col">
          <a
            href={episode.link}
            target="_blank"
            rel="noreferrer"
            className="text-base leading-7 hover:underline hover:underline-offset-4"
          >
            {episode.title}
          </a>
          {episode.date && (
            <p className="font-sans text-xs leading-7 text-muted">
              {formatDate(episode.date)}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
