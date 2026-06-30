import { useState, useEffect } from 'react';
import BookCard from './components/BookCard';
import type { BookDTO } from './types/BookDTO';

export default function App() {
  // State: This holds your book once it arrives from the backend
  const [book, setBook] = useState<BookDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hardcoding the ID from your Postman logs for testing
  const TEST_BOOK_ID = "24ce49a4-24e2-46d6-8f39-1361408f0b32";

  useEffect(() => {
    // 1. Fetch the data from your Spring Boot controller
    fetch(`http://localhost:8081/api/books/${TEST_BOOK_ID}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch book");
        return response.json();
      })
      .then((data: BookDTO) => {
        // 2. Save the data into React state
        setBook(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []); // The empty array means "only run this fetch once when the page loads"

  return (
    <div className="min-h-screen bg-slate-900 p-8 flex flex-col items-center justify-center font-sans">
      <h1 className="text-3xl font-bold text-white mb-8">Ravenhall Library</h1>
      
      {error && <p className="text-red-500">{error}</p>}
      
      {/* If we have a book, render the card. If not, show loading. */}
      {book ? (
        <BookCard book={book} />
      ) : (
        <p className="text-slate-400">Loading book data from Spring Boot...</p>
      )}
    </div>
  );
}