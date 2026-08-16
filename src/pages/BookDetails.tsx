import  BookDetailsCard from "../components/Book/BookDetailsCard";
import { useParams } from "react-router-dom";
import apiClient from "../api/ApiClient";
import { useEffect, useState } from "react";
import type BookDTO from "../types/BookDTO";

export const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState<BookDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        if (id) {
            apiClient.get(`/books/${id}`)
                .then((response) => {
                    setBook(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching book details:", error);
                    setIsLoading(false);
                });
            }}, [id]);

    if (isLoading) {
        return <div className="min-h-screen bg-surface p-8 text-white">Loading...</div>;
    }

    if (!book) {
        return <div className="min-h-screen bg-surface p-8 text-white">Book not found.</div>;
    }

    return (
        <div className="min-h-screen bg-surface p-8">
            <BookDetailsCard book={book} />
        </div>
    );
}