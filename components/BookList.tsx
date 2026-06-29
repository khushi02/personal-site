import type { Book } from "@/lib/goodreads";

export default function BookList({ books }: { books: Book[] }) {
  if (!books.length) {
    return <p className="text-muted">Nothing on the shelf right now.</p>;
  }

  return (
    <ul className="flex flex-col gap-5">
      {books.map((book) => (
        <li
          key={book.title}
          className="bujo-bullet flex flex-col gap-0.5"
        >
          <a
            href={book.link}
            target="_blank"
            rel="noreferrer"
            className="text-lg leading-snug hover:underline hover:underline-offset-4"
          >
            {book.title}
          </a>
          {book.author && (
            <p className="font-sans text-xs text-muted">{book.author}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
