// YouTube fetching + parsing for "The Dry Run" channel.
//
// YouTube exposes a per-channel RSS feed (no API key needed), keyed off the
// channel ID — not the @handle. We fetch it at build time (and on weekly ISR
// revalidation), parse the entries, and fall back to a hardcoded list so the
// section never breaks.
//
// The feed mixes full episodes with Shorts, but "The Dry Run" section is for
// full-length episodes only. The RSS carries no duration, so we detect Shorts
// by probing youtube.com/shorts/{id}: a Short returns 200, while a regular
// video redirects (303) to its /watch page. Anything that isn't confirmed a
// Short is kept, so a failed probe never drops a real episode.

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

// Seeded from the live feed (full-length episodes only) — used if the fetch fails.
const HARDCODED_FALLBACK: Episode[] = [
  {
    title: "How do agentic payments work? | Lincoln Murr, Coinbase",
    link: "https://www.youtube.com/watch?v=ZDcsnGESXog",
    date: "2026-08-12",
  },
  {
    title:
      "Why the best designers make the worst employees | Simon Corry (Basis, Ramp)",
    link: "https://www.youtube.com/watch?v=W1bB4J7rz2I",
    date: "2026-07-29",
  },
  {
    title:
      "From Louis Vuitton to Stablecoin Orchestration: How Digital Assets Solve Card Payments | Gap, Suby",
    link: "https://www.youtube.com/watch?v=64Wi8bh8DtE",
    date: "2026-07-15",
  },
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

// A parsed feed entry, carrying the videoId so we can probe for Shorts.
type ParsedEntry = Episode & { videoId: string | null };

async function tryRss(): Promise<ParsedEntry[]> {
  const res = await fetch(FEED_URL, {
    headers: HEADERS,
    next: { revalidate: 604800 }, // weekly
  });
  if (!res.ok) throw new Error(`YouTube RSS HTTP ${res.status}`);

  const xml = await res.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  const episodes: ParsedEntry[] = [];
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
      videoId: tag(entry, "yt:videoId"),
    });
  }
  return episodes;
}

// A Short lives at youtube.com/shorts/{id} and returns 200; a full episode
// redirects (3xx) to /watch. On any error we assume it's a full episode so a
// flaky probe never hides a real one.
async function isShort(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: "HEAD",
      headers: HEADERS,
      redirect: "manual",
      next: { revalidate: 604800 }, // weekly, matches the feed
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

// Drop Shorts, keeping only full-length episodes. Entries without a videoId
// (nothing to probe) are kept as-is.
async function fullEpisodesOnly(entries: ParsedEntry[]): Promise<Episode[]> {
  const shortFlags = await Promise.all(
    entries.map((e) => (e.videoId ? isShort(e.videoId) : Promise.resolve(false)))
  );
  return entries
    .filter((_, i) => !shortFlags[i])
    .map(({ title, link, date }) => ({ title, link, date }));
}

export async function getRecentEpisodes(): Promise<Episode[]> {
  try {
    const parsed = await tryRss();
    if (parsed.length > 0) {
      const episodes = await fullEpisodesOnly(parsed);
      if (episodes.length > 0) return episodes.slice(0, MAX_EPISODES);
    }
    console.warn("[youtube] RSS returned no full episodes, using hardcoded");
  } catch (err) {
    console.warn("[youtube] RSS failed, using hardcoded:", err);
  }
  return HARDCODED_FALLBACK.slice(0, MAX_EPISODES);
}
