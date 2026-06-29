import Image from "next/image";
import type { Book } from "@/lib/goodreads";

export default function BookList({ books }: { books: Book[] }) {
  if (!books.length) {
    return <p className="text-muted">Nothing on the shelf right now.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
      {books.map((book) => (
        <li key={book.title} className="flex flex-col gap-2">
          <a
            href={book.link}
            target="_blank"
            rel="noreferrer"
            className="group block"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm bg-line">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="(max-width: 640px) 45vw, 200px"
                  className="object-cover transition-opacity group-hover:opacity-90"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-muted">
                  {book.title}
                </div>
              )}
            </div>
          </a>
          <div className="leading-snug">
            <a
              href={book.link}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {book.title}
            </a>
            {book.author && (
              <p className="text-xs text-muted">{book.author}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
