import type BookDTO from "../../types/Book";


interface BookCardProps {
    book: BookDTO;
}

export default function BookCard({ book }: BookCardProps) {
    const titlePref = localStorage.getItem('titlePref') || 'local';
    const title = titlePref === 'local' ? book.localTitle : book.apiTitle;

    const authorPref = localStorage.getItem('authorPref') || 'local';
    const authors = authorPref === 'local' ? book.localAuthors : book.apiAuthors;

    return (
        <div className="bg-surface-hover p-4 rounded-lg shadow-md border border-borderbase flex flex-col h-full transition-all duration-300 hover:border-white-900 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] cursor-pointer">
            {book.coverUrl ? (
                <img 
                    src={book.coverUrl} 
                    alt={`${book.localTitle} cover`} 
                    className="w-full h-auto rounded mb-4 object-cover" 
                />
            ) : (
                <div className="w-full aspect-[2/3] bg-surface rounded mb-4 flex items-center justify-center border border-borderbase">
                    <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            )}
            <h2 className="text-lg font-semibold text-white mb-1 line-clamp-2">{title}</h2>
            <p className="text-sm text-muted mb-2">By {authors?.join(', ') || 'Unknown Author'}</p>      
        </div>
    );
}