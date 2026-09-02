import { useState, useEffect } from 'react';
import type Book from '../types/Book';
import apiClient from '../api/ApiClient';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    apiClient.get('/books/allBooks')
      .then((response) => {
        setBooks(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch books');
        setIsLoading(false);
      });
  }, []);

  // the filtering logic lives here, isolated from the UI
  const filteredBooks = books.filter((book) => {
    if (searchQuery === '') return true;
    return book.localTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return {
    filteredBooks,
    error,
    isLoading,
    searchQuery,
    setSearchQuery
  };
}