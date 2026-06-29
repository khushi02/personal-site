// Goodreads fetching + parsing with layered fallbacks.
//
// Strategy:
//   1. Try the "currently-reading" RSS feed (cleanest, structured data).
//   2. If that fails or returns nothing, scrape the public HTML profile page.
//   3. If both fail, return a small hardcoded list so the section never breaks.
//
// All of this runs at build time (and on ISR revalidation), never in the browser.

export type Book = {
  title: string;
  author: string;
  link: string;
  cover: string | null;
};

const USER_ID = "169322661";
const RSS_URL = `https://www.goodreads.com/review/list_rss/${USER_ID}?shelf=currently-reading`;
const PROFILE_URL = `https://www.goodreads.com/user/show/${USER_ID}-khushi`;

// A realistic UA — Goodreads sometimes returns empty/blocked bodies to obvious bots.
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

const HARDCODED_FALLBACK: Book[] = [
  {
    title: "Everything Is Tuberculosis",
    author: "John Green",
    link: "https://www.goodreads.com/book/show/217150925-everything-is-tuberculosis",
    cover: null,
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    link: "https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning",
    cover: null,
  },
  {
    title: "Principles for Dealing with the Changing World Order",
    author: "Ray Dalio",
    link: "https://www.goodreads.com/book/show/58659367-principles-for-dealing-with-the-changing-world-order",
    cover: null,
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

// Goodreads serves small thumbnails (._SX50_ etc). Strip the size token for a larger cover.
function upscaleCover(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/\._S[XY]\d+_/g, "").replace(/\._S[XY]\d+_/g, "");
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decodeEntities(m[1]) : null;
}

async function tryRss(): Promise<Book[]> {
  const res = await fetch(RSS_URL, {
    headers: HEADERS,
    next: { revalidate: 2592000 },
  });
  if (!res.ok) throw new Error(`RSS HTTP ${res.status}`);

  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  const books: Book[] = [];
  for (const item of items) {
    const title = tag(item, "title");
    if (!title) continue;
    const cover =
      tag(item, "book_large_image_url") ?? tag(item, "book_image_url");
    // Prefer the book's own Goodreads page (/book/show/{id}) over the
    // user's review page that the <link> tag points at.
    const bookId = tag(item, "book_id");
    const link = bookId
      ? `https://www.goodreads.com/book/show/${bookId}`
      : tag(item, "link") ?? PROFILE_URL;
    books.push({
      title,
      author: tag(item, "author_name") ?? "",
      link,
      cover: upscaleCover(cover),
    });
  }
  return books;
}

async function tryHtml(): Promise<Book[]> {
  const res = await fetch(PROFILE_URL, {
    headers: HEADERS,
    next: { revalidate: 2592000 },
  });
  if (!res.ok) throw new Error(`HTML HTTP ${res.status}`);

  const html = await res.text();

  // Each book on the shelf renders as a table row with a cover <img> whose
  // title/alt holds the book name, wrapped in an /book/show/ anchor.
  // We scope to the "currently reading" box when present, otherwise scan all.
  let scope = html;
  const boxMatch = html.match(
    /currently reading[\s\S]*?(<div[^>]*class="?clearFloats"?[\s\S]*?)(?=<div[^>]*class="?bigBox)/i
  );
  if (boxMatch) scope = boxMatch[1];

  const books: Book[] = [];
  const seen = new Set<string>();

  // Match: <a ... href="/book/show/...">...<img ... title="Title" ... src="cover" ...>
  const rowRe =
    /<a[^>]+href="(\/book\/show\/[^"]+)"[^>]*>[\s\S]*?<img[^>]*\btitle="([^"]+)"[^>]*\bsrc="([^"]+)"/gi;

  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(scope)) !== null) {
    const link = `https://www.goodreads.com${m[1]}`;
    const title = decodeEntities(m[2]);
    const cover = upscaleCover(m[3]);
    if (seen.has(title)) continue;
    seen.add(title);

    // Author often sits in a nearby ".authorName" span; best-effort lookup.
    const after = scope.slice(m.index, m.index + 1200);
    const authorMatch = after.match(
      /authorName[^>]*>[\s\S]*?<span[^>]*>([^<]+)</i
    );
    books.push({
      title,
      author: authorMatch ? decodeEntities(authorMatch[1]) : "",
      link,
      cover,
    });
  }
  return books;
}

export async function getCurrentlyReading(): Promise<Book[]> {
  try {
    const rss = await tryRss();
    if (rss.length > 0) return rss;
    console.warn("[goodreads] RSS returned no items, falling back to HTML");
  } catch (err) {
    console.warn("[goodreads] RSS failed, falling back to HTML:", err);
  }

  try {
    const html = await tryHtml();
    if (html.length > 0) return html;
    console.warn("[goodreads] HTML scrape returned no items, using hardcoded");
  } catch (err) {
    console.warn("[goodreads] HTML scrape failed, using hardcoded:", err);
  }

  return HARDCODED_FALLBACK;
}
