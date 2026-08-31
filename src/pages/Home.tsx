import BookCard from '../components/Book/BookCard';
import SearchBar from '../components/SearchBar';
import { useBooks } from '../hooks/useBooks';
import { Link } from 'react-router-dom';


import { Sidebar } from '../components/Sidebar';

export const Home = () =>
{
    const { filteredBooks, error, isLoading, searchQuery, setSearchQuery } = useBooks();

    return (
    <div className="flex h-screen w-full bg-surface text-primary font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* HEADER */}
        <header className="sticky top-0 z-10 bg-surface/95 backdrop-blur border-b border-surface-hover px-8 py-5 flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Books</h2>
          <div className="w-64 h-9 bg-surface-hover rounded-md border border-borderbase flex items-center px-3 text-sm text-muted">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </header>

        {/* GRID CONTAINER */}
        <main className="p-8 max-w-[1600px] w-full">
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted animate-pulse">Loading book data from Spring Boot...</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBooks.map((book) => (
                <Link to={`/books/${book.id}`} key={book.id} className="block h-full outline-none">
                  <BookCard book={book} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 col-span-full">
               <p className="text-muted">No books found matching "{searchQuery}"</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}