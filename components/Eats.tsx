"use client";

import { useState } from "react";
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

const TERRACOTTA = "#e0a98c";

function SpotList({ spots }: { spots: Spot[] }) {
  return (
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
  );
}

function Subheader({ label }: { label: string }) {
  return (
    <h3
      className="font-display text-xl leading-7"
      style={{ ["--marker" as string]: TERRACOTTA }}
    >
      <span className="marker">{label}</span>
    </h3>
  );
}

export default function Eats() {
  const [active, setActive] = useState<keyof EatsData>("restaurants");

  return (
    <>
      {/* Mobile: tabs you can switch between */}
      <div className="flex flex-col gap-7 sm:hidden">
        <div className="flex h-7 items-center gap-5" role="tablist">
          {CATEGORIES.map((c) => {
            const isActive = c.key === active;
            return (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(c.key)}
                className="font-display text-xl leading-7"
                style={isActive ? { ["--marker" as string]: TERRACOTTA } : undefined}
              >
                <span className={isActive ? "marker" : "text-muted"}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
        <SpotList spots={data[active]} />
      </div>

      {/* Desktop: three columns side by side */}
      <div className="hidden gap-6 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-line">
        {CATEGORIES.map((c, i) => (
          <div
            key={c.key}
            className={`flex flex-col gap-7 ${i > 0 ? "sm:pl-6" : ""}`}
          >
            <Subheader label={c.label} />
            <SpotList spots={data[c.key]} />
          </div>
        ))}
      </div>
    </>
  );
}
