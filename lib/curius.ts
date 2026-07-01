// Curius fetching for "Highlights".
//
// Curius has no public RSS, but its site is backed by a JSON API (no key needed).
//   - https://curius.app/api/users/khushi-wadhwa  -> resolves the numeric user id
//   - https://curius.app/api/users/{id}/links      -> saved links, newest first
//
// Each link carries a `highlights[]` array — the passages highlighted while
// reading ("notes"). We surface the highlighted text as the post-it body and the
// article's author as the subtext. Fetched at build time (ISR every 3 days),
// limited to the last 7 days and capped so the notes fit on a single row. When an
// author has multiple highlights, we keep only the shortest one.

export type Highlight = {
  text: string; // the highlighted passage
  author: string; // article author (falls back to the domain)
  url: string;
  date: string; // ISO — when the highlight was made
};

const USER_ID = 7173;
const LINKS_URL = `https://curius.app/api/users/${USER_ID}/links`;
const PROFILE_URL = "https://curius.app/khushi-wadhwa";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "application/json",
};

const MAX_HIGHLIGHTS = 6;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_TEXT = 150; // keep quotes short enough to read as post-its

type CuriusHighlight = { highlight: string; createdDate: string };
type CuriusLink = {
  link: string;
  title: string;
  createdDate: string;
  highlights?: CuriusHighlight[];
};

const HARDCODED_FALLBACK: Highlight[] = [
  {
    text: "we’re living through this kind of eclipse of the human intellect where we’re in the final days of humans being the primary actors on this planet",
    author: "borretti.me",
    url: "https://borretti.me/article/no-one-escapes-the-permanent-underclass",
    date: "2026-07-01",
  },
  {
    text: "Remember, velocity is a vector (it requires direction) and momentum requires mass (the work needs to matter).",
    author: "Yoni Rechtman",
    url: "https://99d.substack.com/p/there-will-only-be-four-jobs",
    date: "2026-06-30",
  },
  {
    text: "An online, distributed generation has developed a coherent aesthetic category for the embodied structure of contemporary, online life, and Backrooms…",
    author: "katie",
    url: "https://blog.katiechiou.xyz/p/people-are-missing-the-point-about",
    date: "2026-06-29",
  },
  {
    text: "the internet is too optimized now, too paved over. everybody's just paying rent to the feed.",
    author: "kashvi",
    url: "https://kashvi.substack.com/p/a-memoir-for-the-internet-we-lost",
    date: "2026-06-24",
  },
];

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Authors are embedded in Curius titles: "Title - by Author" or the Substack
// form "Title | Author | Substack". Fall back to the domain when neither matches.
function parseAuthor(title: string, url: string): string {
  const byMatch = title.match(/\s[-–—]\s*by\s+(.+?)\s*$/i);
  if (byMatch) return byMatch[1].trim();
  const substack = title.match(/\|\s*([^|]+?)\s*\|\s*substack\s*$/i);
  if (substack) return substack[1].trim();
  return hostname(url);
}

function truncate(s: string): string {
  const t = s.trim();
  if (t.length <= MAX_TEXT) return t;
  const cut = t.slice(0, MAX_TEXT);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

// Returns every highlight (untruncated) across all links, so callers can dedupe.
async function tryApi(): Promise<Highlight[]> {
  const res = await fetch(LINKS_URL, {
    headers: HEADERS,
    next: { revalidate: 259200 }, // every 3 days
  });
  if (!res.ok) throw new Error(`Curius HTTP ${res.status}`);

  const data = (await res.json()) as { userSaved?: CuriusLink[] };
  const saved = data.userSaved ?? [];

  const out: Highlight[] = [];
  for (const l of saved) {
    if (!l.link || !l.highlights?.length) continue;
    const author = parseAuthor(l.title ?? "", l.link);
    for (const h of l.highlights) {
      if (!h?.highlight?.trim()) continue;
      out.push({
        text: h.highlight.trim(),
        author,
        url: l.link,
        date: h.createdDate || l.createdDate,
      });
    }
  }
  return out;
}

export async function getRecentHighlights(): Promise<Highlight[]> {
  try {
    const all = await tryApi();
    if (all.length > 0) {
      const cutoff = Date.now() - WEEK_MS;
      const recent = all.filter((h) => {
        const t = new Date(h.date).getTime();
        return !Number.isNaN(t) && t >= cutoff;
      });
      const pool = recent.length > 0 ? recent : all;

      // One note per author; when an author has several highlights, keep the
      // shortest so the post-its stay punchy.
      const byAuthor = new Map<string, Highlight>();
      for (const h of pool) {
        const key = h.author.toLowerCase();
        const current = byAuthor.get(key);
        if (!current || h.text.length < current.text.length) {
          byAuthor.set(key, h);
        }
      }

      return [...byAuthor.values()]
        .sort((a, b) => +new Date(b.date) - +new Date(a.date))
        .slice(0, MAX_HIGHLIGHTS)
        .map((h) => ({ ...h, text: truncate(h.text) }));
    }
    console.warn("[curius] API returned no highlights, using hardcoded");
  } catch (err) {
    console.warn("[curius] API failed, using hardcoded:", err);
  }
  return HARDCODED_FALLBACK.slice(0, MAX_HIGHLIGHTS);
}

// The profile link surfaced in the UI's "see more" affordance.
export const CURIUS_PROFILE = PROFILE_URL;
