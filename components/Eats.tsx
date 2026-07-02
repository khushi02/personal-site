"use client";

import { useState } from "react";
import eatsData from "@/data/eats.json";

type Spot = {
  name: string;
  rating: number;
  note?: string;
  map?: string;
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

function SpotList({ spots }: { spots: Spot[] }) {
  return (
    <ul className="flex flex-col divide-y divide-line">
      {spots.slice(0, 5).map((spot) => (
        <li
          key={spot.name}
          className="flex items-baseline justify-between gap-3 py-3 first:pt-0"
        >
          <span className="flex flex-col">
            {spot.map ? (
              <a
                href={spot.map}
                target="_blank"
                rel="noreferrer"
                className="font-serif text-base leading-snug text-ink transition-colors hover:text-terracotta"
              >
                {spot.name}
              </a>
            ) : (
              <span className="font-serif text-base leading-snug text-ink">
                {spot.name}
              </span>
            )}
            {spot.note && (
              <span className="mt-0.5 text-xs text-muted">{spot.note}</span>
            )}
          </span>
          <span className="shrink-0 text-xs tabular-nums text-muted">
            {spot.rating.toFixed(1)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Eats() {
  const [active, setActive] = useState<keyof EatsData>("restaurants");

  return (
    <>
      {/* Mobile: tabs you can switch between */}
      <div className="flex flex-col gap-5 sm:hidden">
        <div className="flex gap-6" role="tablist">
          {CATEGORIES.map((c) => {
            const isActive = c.key === active;
            return (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(c.key)}
                className={`label border-b pb-2 transition-colors ${
                  isActive
                    ? "border-terracotta !text-ink"
                    : "border-transparent"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <SpotList spots={data[active]} />
      </div>

      {/* Desktop: three columns side by side */}
      <div className="hidden gap-8 sm:grid sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <div key={c.key} className="flex flex-col gap-4">
            <h3 className="label border-b border-line pb-2">{c.label}</h3>
            <SpotList spots={data[c.key]} />
          </div>
        ))}
      </div>
    </>
  );
}
