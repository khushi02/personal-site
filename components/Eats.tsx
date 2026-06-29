import eats from "@/data/eats.json";

type Eat = {
  name: string;
  city: string;
  rating: number;
  note: string;
};

export default function Eats() {
  const items = (eats as Eat[]).slice(0, 10);

  return (
    <ul className="flex flex-col divide-y divide-line">
      {items.map((item) => (
        <li
          key={item.name + item.city}
          className="flex items-start justify-between gap-4 py-4 first:pt-0"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-medium">{item.name}</span>
            {item.city && (
              <span className="text-xs text-muted">{item.city}</span>
            )}
            {item.note && (
              <span className="mt-1 text-sm text-muted">{item.note}</span>
            )}
          </div>
          <span className="shrink-0 text-sm tabular-nums text-ink">
            {item.rating.toFixed(1)}
          </span>
        </li>
      ))}
    </ul>
  );
}
