import type BookDTO from "../../types/BookDTO";
import { useState, useEffect } from "react";
import apiClient from "../../api/ApiClient";

interface BookCardProps {
    book: BookDTO;
}

export default function BookCard({ book }: BookCardProps) {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    useEffect(() => {
        let activeUrl: string | null = null;
        
        apiClient.get(`/books/${book.id}/cover`, {
            responseType: 'arraybuffer'
        })
        .then((response) => {
            const blob = new Blob([response.data]); 
            activeUrl = URL.createObjectURL(blob);
            setCoverUrl(activeUrl);
        })
        .catch((error) => {
            console.error(`Failed to load cover for book ${book.id}:`, error);
        });

        return () => {
            if (activeUrl) {
                URL.revokeObjectURL(activeUrl);
            }
        };
    }, [book.id]);

    return (
        <div className="bg-surface-hover p-4 rounded-lg shadow-md border border-borderbase flex flex-col h-full transition-all duration-300 hover:border-white-900 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] cursor-pointer">
            {coverUrl ? (
                <img 
                    src={coverUrl} 
                    alt={`${book.localTitle} cover`} 
                    className="w-full h-auto rounded mb-4 object-cover" 
                />
            ) : (
                <div className="w-full aspect-[2/3] bg-surface rounded mb-4 flex items-center justify-center border border-borderbase">
                    <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            )}
            <h2 className="text-lg font-semibold text-white mb-1 line-clamp-2">{book.localTitle}</h2>
            <p className="text-sm text-muted mb-2">By {book.localAuthors?.join(', ') || 'Unknown Author'}</p>      
        </div>
    );
}