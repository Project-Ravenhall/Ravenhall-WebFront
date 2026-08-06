import type { BookDTO } from "../types/BookDTO";

interface BookCardProps {
    book: BookDTO;
}

export default function BookCard({ book }: BookCardProps) {
    const formattedDate = new Date(book.addedAt).toLocaleDateString();

    return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md border border-slate-800 max-w-[14rem] flex flex-col h-full">
      <img 
        src={`http://localhost:8081/api/v1/books/${book.id}/cover`} 
        alt={`${book.localTitle} cover`} 
        className="w-full h-auto rounded mb-4" 
        referrerPolicy="no-referrer" 
      />
      <h2 className="text-lg font-semibold text-white mb-1 line-clamp-2">{book.localTitle}</h2>
      <p className="text-sm text-slate-400 mb-2">By {book.localAuthors}</p>
      <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-grow">{book.synopsis}</p>
      <div className="text-xs text-slate-500 mt-auto pt-3 border-t border-slate-700">
        <p>Added: {formattedDate}</p>
      </div>
    </div>
  );
}