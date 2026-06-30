import type { Book } from "@/lib/goodreads";

export default function BookList({ books }: { books: Book[] }) {
  if (!books.length) {
    return <p className="text-muted">Nothing on the shelf right now.</p>;
  }

  return (
    <ul className="flex flex-col gap-7">
      {books.map((book) => (
        <li key={book.title} className="bujo-bullet flex flex-col">
          <a
            href={book.link}
            target="_blank"
            rel="noreferrer"
            className="text-base leading-7 hover:underline hover:underline-offset-4"
          >
            {book.title}
          </a>
          {book.author && (
            <p className="font-sans text-xs leading-7 text-muted">
              {book.author}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
