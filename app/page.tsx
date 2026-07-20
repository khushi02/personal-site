import BookList from "@/components/BookList";
import Highlights from "@/components/Highlights";
import Episodes from "@/components/Episodes";
import Eats from "@/components/Eats";
import SocialLinks from "@/components/Social";
import NowPlaying from "@/components/NowPlaying";
import { getCurrentlyReading } from "@/lib/goodreads";
import { getRecentEpisodes } from "@/lib/youtube";
import { getRecentHighlights } from "@/lib/curius";

// Baseline route revalidation (ISR). Individual fetches set their own, shorter
// windows — Curius every 3 days (drives the effective route cadence), YouTube
// weekly, Goodreads every 30 days — so each source refreshes on its own clock.
export const revalidate = 604800; // 7 days

function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <h2 className="label">{title}</h2>
      {action}
    </div>
  );
}

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="label transition-colors hover:text-terracotta"
    >
      {label}
    </a>
  );
}

function BioLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-muted underline decoration-muted/50 decoration-1 underline-offset-[3px] transition-colors hover:decoration-terracotta"
    >
      {children}
    </a>
  );
}

export default async function Home() {
  const [books, episodes, highlights] = await Promise.all([
    getCurrentlyReading(),
    getRecentEpisodes(),
    getRecentHighlights(),
  ]);

  return (
    <main className="relative mx-auto max-w-2xl px-6 py-16 sm:py-28 lg:max-w-6xl">
      <NowPlaying />
      <div className="flex flex-col gap-16">
        {/* Header / Intro */}
        <header className="flex flex-col gap-5">
          <p className="label">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
            khushi&apos;s notebook
          </h1>
          <p className="font-serif text-2xl italic text-muted">
            a curated collection of places and ideas
          </p>
          <p className="max-w-prose text-sm leading-relaxed text-muted">
            currently @ <BioLink href="https://predicate.io/">predicate</BioLink>
            . previously @{" "}
            <BioLink href="https://geometry.xyz">geometry</BioLink>,{" "}
            <BioLink href="https://www.generalcatalyst.com/stories/c14-ramping-the-next-billion-digital-asset-users">
              c14
            </BioLink>
            , <BioLink href="https://www.spacex.com/">spacex</BioLink>,{" "}
            <BioLink href="https://www.cs.cmu.edu/index">carnegie mellon</BioLink>
            .
          </p>
          <div className="pt-1">
            <SocialLinks />
          </div>
        </header>

        {/* Top spread: The Dry Run (left) + Currently Reading (right) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
          <section className="flex flex-col gap-6 lg:pr-14">
            <SectionTitle
              title="the dry run"
              action={
                <MoreLink
                  href="https://www.youtube.com/@TheDryRunPod"
                  label="youtube"
                />
              }
            />
            {/* Show as many episodes as there are books (when enough exist). */}
            <Episodes episodes={episodes.slice(0, books.length)} />
          </section>

          <section className="flex flex-col gap-6 lg:border-l lg:border-line lg:pl-14">
            <SectionTitle
              title="currently reading"
              action={
                <MoreLink
                  href="https://www.goodreads.com/user/show/169322661-khushi"
                  label="goodreads"
                />
              }
            />
            <BookList books={books} />
          </section>
        </div>

        {/* Highlights — full width */}
        <section className="flex flex-col gap-6">
          <SectionTitle
            title="highlights"
            action={
              <MoreLink
                href="https://curius.app/khushi-wadhwa"
                label="see more on curius"
              />
            }
          />
          <Highlights highlights={highlights} />
        </section>

        {/* Good Eats — three NYC columns, full width */}
        <section className="flex flex-col gap-6">
          <SectionTitle
            title="nyc hit list"
            action={
              <MoreLink
                href="https://beliapp.co/app/khushi02"
                label="see more on beli"
              />
            }
          />
          <Eats />
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="label">
            © {new Date().getFullYear()} khushi wadhwa
          </span>
          <SocialLinks />
        </footer>
      </div>
    </main>
  );
}
