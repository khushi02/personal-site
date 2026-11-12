import Links from "@/components/Links";
import NowPlaying from "@/components/NowPlaying";

function BioLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center px-6 pb-10 pt-16 sm:pb-11 sm:pt-[72px]">
      <NowPlaying />
      <div className="flex-1" />

      <header className="flex flex-col items-center text-center">
        {/* Typographic ornament: hairline, diamond, hairline. */}
        <svg
          viewBox="0 0 120 12"
          width="120"
          height="12"
          fill="none"
          aria-hidden="true"
          className="mb-[26px] stroke-muted"
        >
          <path d="M0 6h48M72 6h48" />
          <path d="M60 1.5l4.500 4.500l-4.500 4.500l-4.500-4.500z" />
        </svg>

        <h1 className="text-[40px] leading-[1.1] tracking-[-0.045em] sm:text-[46px]">
          khushi wadhwa
        </h1>

        <p className="mt-[22px] max-w-[30rem] text-lg leading-normal sm:text-xl sm:leading-normal">
          currently @ <BioLink href="https://predicate.io/">predicate</BioLink>,
          conversing @{" "}
          <BioLink href="https://www.youtube.com/@TheDryRunPod">dry run</BioLink>
          . <br className="hidden sm:inline" />
          previously @ <BioLink href="https://geometry.xyz">geometry</BioLink>,{" "}
          <BioLink href="https://www.generalcatalyst.com/stories/c14-ramping-the-next-billion-digital-asset-users">
            c14
          </BioLink>
          , <BioLink href="https://www.spacex.com/">spacex</BioLink>,{" "}
          <BioLink href="https://www.cs.cmu.edu/index">carnegie mellon</BioLink>.
        </p>
      </header>

      <div className="flex-1" />

      <footer className="-mx-4 pt-12 sm:mx-0">
        <Links />
      </footer>
    </main>
  );
}
