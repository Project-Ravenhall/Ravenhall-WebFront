import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import { useBooks } from '../hooks/useBooks';

export const Home = () =>
{
    const { filteredBooks, error, isLoading, searchQuery, setSearchQuery } = useBooks();

    return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 hidden md:flex flex-col p-6">
        <h1 className="text-2xl font-bold text-white mb-8 tracking-wide">Ravenhall</h1>
        <nav className="flex flex-col gap-4 text-slate-400 font-medium">
          <a href="#" className="text-white hover:text-white transition-colors">Library</a>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* HEADER */}
        <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-8 py-5 flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Books</h2>
          <div className="w-64 h-9 bg-slate-800 rounded-md border border-slate-700 flex items-center px-3 text-sm text-slate-400">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </header>

        {/* GRID CONTAINER */}
        <main className="p-8">
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-400 animate-pulse">Loading book data from Spring Boot...</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 col-span-full">
               <p className="text-slate-400">No books found matching "{searchQuery}"</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}