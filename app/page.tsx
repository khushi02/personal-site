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

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          {title}
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
        <header className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            khushi wadhwa
          </h1>
          <p className="text-lg text-ink">
            building, reading, eating.
          </p>
          <p className="max-w-prose text-base leading-relaxed text-muted">
            welcome to my corner of the internet. a running snapshot of 
            what&apos;s been keeping me busy.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm">
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
          title="Currently Reading"
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
          title="Highlights"
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
          title="Good Eats"
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
        <footer className="flex flex-col gap-3 border-t border-line pt-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Khushi Wadhwa</span>
          <nav className="flex gap-x-5">
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
