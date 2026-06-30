import eatsData from "@/data/eats.json";

type Spot = {
  name: string;
  rating: number;
  note?: string;
};

type EatsData = {
  restaurants: Spot[];
  drinks: Spot[];
  coffee: Spot[];
};

const data = eatsData as EatsData;

const CATEGORIES: { key: keyof EatsData; label: string }[] = [
  { key: "restaurants", label: "restaurants" },
  { key: "drinks", label: "drinks" },
  { key: "coffee", label: "coffee" },
];

function Column({ label, spots }: { label: string; spots: Spot[] }) {
  return (
    <div className="flex flex-col gap-7">
      {/* Subheader — terracotta */}
      <h3
        className="font-display text-xl leading-7"
        style={{ ["--marker" as string]: "#e0a98c" }}
      >
        <span className="marker">{label}</span>
      </h3>
      <ul className="flex flex-col gap-7">
        {spots.slice(0, 5).map((spot) => (
          <li
            key={spot.name}
            className="bujo-bullet flex items-center justify-between gap-3"
          >
            <span className="flex flex-col">
              <span className="text-lg leading-7">{spot.name}</span>
              {spot.note && (
                <span className="font-sans text-xs leading-7 text-muted">
                  {spot.note}
                </span>
              )}
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay-light font-sans text-xs font-semibold tabular-nums text-ink">
              {spot.rating.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Eats() {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-6 sm:divide-x sm:divide-line">
      {CATEGORIES.map((c, i) => (
        <div key={c.key} className={i > 0 ? "sm:pl-6" : ""}>
          <Column label={c.label} spots={data[c.key]} />
        </div>
      ))}
    </div>
  );
}
