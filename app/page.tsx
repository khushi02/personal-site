import BookList from "@/components/BookList";
import Highlights from "@/components/Highlights";
import Episodes from "@/components/Episodes";
import Eats from "@/components/Eats";
import SocialLinks from "@/components/Social";
import { getCurrentlyReading } from "@/lib/goodreads";
import { getRecentEpisodes } from "@/lib/youtube";
import { getRecentHighlights } from "@/lib/curius";

// Revalidate the route weekly (ISR) so new YouTube episodes surface within a
// week. Goodreads is unaffected — its own fetch keeps a 30-day cache.
export const revalidate = 604800; // 7 days

function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-7 items-center justify-between gap-4">
      <h2 className="font-display text-3xl leading-7">
        <span className="marker">{title}</span>
      </h2>
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
      className="link text-sm leading-7 text-muted"
    >
      {label}
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
    <main className="mx-auto max-w-2xl px-6 py-14 sm:py-28 lg:max-w-6xl">
      <div className="flex flex-col gap-14">
        {/* Header / Intro */}
        <header className="flex flex-col gap-7">
          <p className="font-sans text-xs uppercase leading-7 tracking-[0.2em] text-muted">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="font-display text-5xl leading-[3.5rem]">
            khushi's notebook
          </h1>
          <p className="text-xl leading-7 text-ink">a curated collection of places and ideas</p>
          <p className="max-w-prose text-lg leading-7 text-muted">
            currently @{" "}
            <a
              href="https://predicate.io/"
              target="_blank"
              rel="noreferrer"
              className="link text-muted"
            >
              predicate
            </a>
            . previously @{" "}
            <a
              href="https://geometry.xyz"
              target="_blank"
              rel="noreferrer"
              className="link text-muted"
            >
              geometry
            </a>
            ,{" "}
            <a
              href="https://www.generalcatalyst.com/stories/c14-ramping-the-next-billion-digital-asset-users"
              target="_blank"
              rel="noreferrer"
              className="link text-muted"
            >
              c14
            </a>
            ,{" "}
            <a
              href="https://www.spacex.com/"
              target="_blank"
              rel="noreferrer"
              className="link text-muted"
            >
              spacex
            </a>
            ,{" "}
            <a
              href="https://www.cs.cmu.edu/index"
              target="_blank"
              rel="noreferrer"
              className="link text-muted"
            >
              carnegie mellon
            </a>
            .
          </p>
          <SocialLinks />
        </header>

        {/* Top spread: The Dry Run (left page) + Currently Reading (right page) */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-0">
          <section className="flex flex-col gap-7 lg:pr-12">
            <SectionTitle
              title="the dry run"
              action={
                <MoreLink
                  href="https://www.youtube.com/@TheDryRunPod"
                  label="youtube"
                />
              }
            />
            <Episodes episodes={episodes} />
          </section>

          <section className="flex flex-col gap-7 lg:border-l lg:border-line lg:pl-12">
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
        <section className="flex flex-col gap-7">
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
        <section className="flex flex-col gap-7">
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
        <footer className="flex flex-col gap-4 border-t border-line pt-7 text-base leading-7 text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-xl text-ink">
            © {new Date().getFullYear()} khushi wadhwa
          </span>
          <SocialLinks />
        </footer>
      </div>
    </main>
  );
}
