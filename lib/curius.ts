// Curius fetching for "Highlights".
//
// Curius has no public RSS, but its site is backed by a JSON API (no key needed).
//   - https://curius.app/api/users/khushi-wadhwa  -> resolves the numeric user id
//   - https://curius.app/api/users/{id}/links      -> saved links, newest first
//
// Each link carries a `highlights[]` array — the passages highlighted while
// reading ("notes"). We surface the highlighted text as the post-it body and the
// article's author as the subtext. Fetched at build time (weekly ISR). We show
// the last COUNT highlights, one per author (most recent wins) so the sources
// stay varied, and always render exactly COUNT — topping up with repeat authors,
// then a hardcoded fallback, if the feed is ever short.

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

const COUNT = 4; // always show exactly this many highlights
const MAX_TEXT = 150; // keep quotes short enough to read as post-its

type CuriusHighlight = { highlight: string; createdDate: string };
type CuriusLink = {
  link: string;
  title: string;
  createdDate: string;
  highlights?: CuriusHighlight[];
};

// Seeded from the live feed — the four most recent highlights (one per author),
// used only if the network fetch fails so the section always renders four cards.
const HARDCODED_FALLBACK: Highlight[] = [
  {
    text: "a mere 10 minutes of teleoperation data was enough to fine-tune Dyna-2 to do bottle cap opening using two five-fingered robot hands",
    author: "dyna.co",
    url: "https://www.dyna.co/dyna-2",
    date: "2026-08-11",
  },
  {
    text: "Two strategic paths are emerging between generalized foundation models, which aim to replicate the trajectory of frontier AI labs by scaling models across tasks and form factors, and verticalization…",
    author: "insightpartners.com",
    url: "https://www.insightpartners.com/ideas/the-state-of-the-robotics-ecosystem",
    date: "2026-08-03",
  },
  {
    text: "consumers are likely to be the last robotics use case - deploying robots in the home requires the highest safety constraints",
    author: "github.com",
    url: "https://github.com/adam-maj/robotics",
    date: "2026-08-02",
  },
  {
    text: "one of the worst things about tech media, especially as technology has gotten more hostile towards traditional media, is that there isn’t any room for recorded disagreement",
    author: "Reggie James",
    url: "https://hipcityreg.substack.com/p/rules-for-recorded-conversations?s=r",
    date: "2026-07-28",
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
    next: { revalidate: 604800 }, // weekly
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
      const byDate = [...all].sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
      );

      // One note per author (most recent wins) so the post-its stay varied.
      const picked: Highlight[] = [];
      const seenAuthors = new Set<string>();
      for (const h of byDate) {
        const key = h.author.toLowerCase();
        if (seenAuthors.has(key)) continue;
        seenAuthors.add(key);
        picked.push(h);
        if (picked.length >= COUNT) break;
      }

      // If distinct authors ran out before COUNT, top up with the next most
      // recent highlights (repeat authors allowed) so we always show exactly 4.
      if (picked.length < COUNT) {
        const chosen = new Set(picked.map((h) => h.text));
        for (const h of byDate) {
          if (picked.length >= COUNT) break;
          if (!chosen.has(h.text)) picked.push(h);
        }
      }

      // Last resort: pad from the fallback if the feed itself had < COUNT.
      for (const h of HARDCODED_FALLBACK) {
        if (picked.length >= COUNT) break;
        if (!picked.some((p) => p.url === h.url)) picked.push(h);
      }

      return picked.slice(0, COUNT).map((h) => ({ ...h, text: truncate(h.text) }));
    }
    console.warn("[curius] API returned no highlights, using hardcoded");
  } catch (err) {
    console.warn("[curius] API failed, using hardcoded:", err);
  }
  return HARDCODED_FALLBACK.slice(0, COUNT);
}

// The profile link surfaced in the UI's "see more" affordance.
export const CURIUS_PROFILE = PROFILE_URL;
