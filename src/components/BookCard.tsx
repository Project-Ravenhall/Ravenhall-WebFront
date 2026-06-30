import type { BookDTO } from "../types/BookDTO";

interface BookCardProps {
    book: BookDTO;
}

export default function BookCard({ book }: BookCardProps) {
    const formattedDate = new Date(book.addedAt).toLocaleDateString();

    return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700 max-w-sm">
      <h2 className="text-xl font-bold text-white mb-2">{book.title}</h2>
      <p className="text-slate-400 mb-4">By {book.author}</p>
      <div className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-700">
        <p>ID: {book.id}</p>
        <p>Added: {formattedDate}</p>
      </div>
    </div>
  );
}