import BookList from "@/components/BookList";
import Highlights from "@/components/Highlights";
import Eats from "@/components/Eats";
import SocialLinks from "@/components/Social";
import { getCurrentlyReading } from "@/lib/goodreads";

// Re-fetch Goodreads data at most once a month (ISR).
export const revalidate = 2592000; // 30 days

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
  const books = await getCurrentlyReading();

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
            khushi wadhwa
          </h1>
          <p className="text-xl leading-7 text-ink">a curated collection of places and ideas</p>
          <p className="max-w-prose text-lg leading-7 text-muted">
            welcome to my corner of the internet. a running journal of what&apos;s
            been keeping me busy.
          </p>
          <SocialLinks />
        </header>

        {/* Top spread: Currently Reading (left page) + Highlights (right page) */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-0">
          <section className="flex flex-col gap-7 lg:pr-12">
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

          <section className="flex flex-col gap-7 lg:border-l lg:border-line lg:pl-12">
            <SectionTitle
              title="highlights"
              action={
                <MoreLink
                  href="https://curius.app/khushi-wadhwa"
                  label="see more on curius"
                />
              }
            />
            <Highlights />
          </section>
        </div>

        {/* Good Eats — three NYC columns, full width */}
        <section className="flex flex-col gap-7">
          <SectionTitle
            title="good eats — nyc"
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
