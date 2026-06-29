import BookList from "@/components/BookList";
import Highlights from "@/components/Highlights";
import Eats from "@/components/Eats";
import { getCurrentlyReading } from "@/lib/goodreads";

// Re-fetch Goodreads data at most once a month (ISR).
export const revalidate = 2592000; // 30 days

const SOCIALS = {
  github: "https://github.com/khushi02",
  email: "mailto:k9wadhwa@gmail.com",
  linkedin: "https://linkedin.com/in/khushi-wadhwa",
};

// Marker accent per section (maps to tailwind colors.marker.*).
const MARKERS = {
  reading: "#a7e8d8", // teal
  highlights: "#ffc2d1", // pink
  eats: "#b9d4ff", // blue
  header: "#ffe08a", // yellow
};

function Section({
  title,
  accent,
  children,
  action,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section
      className="flex flex-col gap-6"
      style={{ ["--marker" as string]: accent }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl leading-none">
          <span className="marker">{title}</span>
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default async function Home() {
  const books = await getCurrentlyReading();

  return (
    <main className="mx-auto max-w-content px-6 py-16 sm:py-24">
      <div className="flex flex-col gap-16 sm:gap-20">
        {/* Header / Intro */}
        <header
          className="flex flex-col gap-4"
          style={{ ["--marker" as string]: MARKERS.header }}
        >
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="font-display text-6xl leading-none">khushi wadhwa</h1>
          <p className="text-xl text-ink">building, reading, eating.</p>
          <p className="max-w-prose text-lg leading-relaxed text-muted">
            welcome to my corner of the internet. a running journal of what&apos;s
            been keeping me busy.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-lg">
            <a
              href={SOCIALS.github}
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              GitHub
            </a>
            <a href={SOCIALS.email} className="link">
              Email
            </a>
            <a
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              LinkedIn
            </a>
          </nav>
        </header>

        {/* Currently Reading */}
        <Section
          title="currently reading"
          accent={MARKERS.reading}
          action={
            <a
              href="https://www.goodreads.com/user/show/169322661-khushi"
              target="_blank"
              rel="noreferrer"
              className="link text-sm text-muted"
            >
              goodreads
            </a>
          }
        >
          <BookList books={books} />
        </Section>

        {/* Highlights */}
        <Section
          title="highlights"
          accent={MARKERS.highlights}
          action={
            <a
              href="https://curius.app/khushi-wadhwa"
              target="_blank"
              rel="noreferrer"
              className="link text-sm text-muted"
            >
              see more on curius
            </a>
          }
        >
          <Highlights />
        </Section>

        {/* Good Eats */}
        <Section
          title="good eats"
          accent={MARKERS.eats}
          action={
            <a
              href="https://beliapp.co/app/khushi02"
              target="_blank"
              rel="noreferrer"
              className="link text-sm text-muted"
            >
              see more on beli
            </a>
          }
        >
          <Eats />
        </Section>

        {/* Footer */}
        <footer className="flex flex-col gap-3 border-t border-line pt-8 text-base text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-xl text-ink">
            © {new Date().getFullYear()} khushi wadhwa
          </span>
          <nav
            className="flex gap-x-5"
            style={{ ["--marker" as string]: MARKERS.header }}
          >
            <a
              href={SOCIALS.github}
              target="_blank"
              rel="noreferrer"
              className="link text-muted"
            >
              GitHub
            </a>
            <a href={SOCIALS.email} className="link text-muted">
              Email
            </a>
            <a
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link text-muted"
            >
              LinkedIn
            </a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
