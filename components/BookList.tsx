import type { Book } from "@/lib/goodreads";

export default function BookList({ books }: { books: Book[] }) {
  if (!books.length) {
    return <p className="text-sm text-muted">Nothing on the shelf right now.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-line">
      {books.map((book) => (
        <li key={book.title} className="py-4 first:pt-0">
          <a
            href={book.link}
            target="_blank"
            rel="noreferrer"
            className="group block"
          >
            <span className="block font-serif text-lg leading-snug text-ink transition-colors group-hover:text-terracotta">
              {book.title}
            </span>
            {book.author && (
              <span className="mt-1 block text-xs text-muted">
                {book.author}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
