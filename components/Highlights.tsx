import highlights from "@/data/highlights.json";

type Highlight = {
  title: string;
  url: string;
  source: string;
  date: string;
};

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
    <ul className="flex flex-col gap-5">
      {items.map((item) => (
        <li key={item.url + item.title} className="flex flex-col gap-1">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-base font-medium hover:underline hover:underline-offset-4"
          >
            {item.title}
          </a>
          <p className="text-xs text-muted">
            {[item.source, formatDate(item.date)].filter(Boolean).join(" · ")}
          </p>
        </li>
      ))}
    </ul>
  );
}
