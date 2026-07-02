// YouTube fetching + parsing for "The Dry Run" channel.
//
// YouTube exposes a per-channel RSS feed (no API key needed), keyed off the
// channel ID — not the @handle. We fetch it at build time (and on weekly ISR
// revalidation), parse the entries, and fall back to a hardcoded list so the
// section never breaks.

export type Episode = {
  title: string;
  link: string;
  date: string; // ISO publish date
};

const CHANNEL_ID = "UCGTsdFnlj1xnb0d_2lDpumQ";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CHANNEL_URL = "https://www.youtube.com/@TheDryRunPod";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "application/xml,text/xml,*/*;q=0.8",
};

// Upper bound on how many episodes we fetch/keep. The page trims this down to
// match the number of "currently reading" books, so keep enough headroom here.
const MAX_EPISODES = 12;

// Seeded from the live feed — used only if the network fetch fails.
const HARDCODED_FALLBACK: Episode[] = [
  {
    title: "What AI Trading Agents Are Doing With Your Money | Amy Zhao, IC3",
    link: "https://www.youtube.com/watch?v=RXZt5PGgyaI",
    date: "2026-07-01",
  },
  {
    title:
      "Are Crypto Wallets Dead? The Future of Embedded Wallets & Agentic Payments",
    link: "https://www.youtube.com/watch?v=53myRcV3U9k",
    date: "2026-06-17",
  },
  {
    title: "Agents, Creators, and the Pay-Per-Use Internet",
    link: "https://www.youtube.com/watch?v=hQNoyyTz1uc",
    date: "2026-06-09",
  },
  {
    title: "Lessons From Building the First Killer App",
    link: "https://www.youtube.com/watch?v=Ycpg7Y-Krbw",
    date: "2026-05-14",
  },
  {
    title: "Does Fairness Matter in Prediction Markets?",
    link: "https://www.youtube.com/watch?v=hZcVymxZ-0I",
    date: "2026-05-14",
  },
  {
    title: "Innovation Isn't the Hard Part in Payments",
    link: "https://www.youtube.com/watch?v=zXwOtc47w_0",
    date: "2026-05-14",
  },
];

function decodeEntities(str: string): string {
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decodeEntities(m[1]) : null;
}

async function tryRss(): Promise<Episode[]> {
  const res = await fetch(FEED_URL, {
    headers: HEADERS,
    next: { revalidate: 604800 }, // weekly
  });
  if (!res.ok) throw new Error(`YouTube RSS HTTP ${res.status}`);

  const xml = await res.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  const episodes: Episode[] = [];
  for (const entry of entries) {
    const title = tag(entry, "title");
    if (!title) continue;
    // The video URL lives in <link rel="alternate" href="...">.
    const link = entry.match(
      /<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i
    )?.[1];
    episodes.push({
      title,
      link: link ?? CHANNEL_URL,
      date: tag(entry, "published") ?? "",
    });
  }
  return episodes;
}

export async function getRecentEpisodes(): Promise<Episode[]> {
  try {
    const episodes = await tryRss();
    if (episodes.length > 0) return episodes.slice(0, MAX_EPISODES);
    console.warn("[youtube] RSS returned no entries, using hardcoded");
  } catch (err) {
    console.warn("[youtube] RSS failed, using hardcoded:", err);
  }
  return HARDCODED_FALLBACK.slice(0, MAX_EPISODES);
}
