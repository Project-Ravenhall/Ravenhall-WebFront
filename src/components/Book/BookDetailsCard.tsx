import { Link } from "react-router-dom";
import type Book from "../../types/Book";
import { useState, useEffect } from "react";
import apiClient from "../../api/ApiClient";

interface BookDetailsCardProps {
    book: Book;
}


export default function BookDetailsCard({ book }: BookDetailsCardProps) {
    const formattedDate = new Date(book.addedAt).toLocaleDateString();
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
        <div className="flex flex-col md:flex-row gap-8 text-muted-lighter">
            {/* Left Column: Image */}
            <div className="w-full md:w-1/3 md:max-w-xs">
                {coverUrl ? (
                    <img 
                        src={coverUrl} 
                        alt={`${book.localTitle} cover`} 
                        className="w-full h-auto rounded-lg shadow-lg object-cover" 
                    />
                ) : (
                    <div className="w-full aspect-[2/3] bg-surface rounded-lg shadow-lg flex items-center justify-center border border-borderbase">
                        <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                )}

                <div className="mt-8 text-sm text-muted-dark">
                    <p>Added to library: {formattedDate}</p>
                </div>
            </div>

            {/* Right Column: Book Info */}
            <div className="w-full md:w-2/3 flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-white">{book.localTitle}</h1>
                <p className="text-lg text-muted mb-2">By {book.apiAuthors?.join(', ') || 'Unknown Author'}</p>
                
                {(book.apiReleaseYear || (book.apiGenres && book.apiGenres.length > 0)) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-indigo-400/90">
                        {book.apiReleaseYear && <span>Released: {book.apiReleaseYear}</span>}
                        {book.apiGenres && book.apiGenres.length > 0 && (
                            <span className="flex gap-2 items-center">
                                {book.apiReleaseYear && <span className="text-muted-dark px-1">•</span>}
                                {book.apiGenres.join(', ')}
                            </span>
                        )}
                    </div>
                )}
                
                <div className="mt-4 text-muted-light leading-relaxed whitespace-pre-wrap">
                    {book.synopsis}
                </div>

                {/* Assets Section */}
                {book.assets && book.assets.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-borderbase/50">
                        <h3 className="text-lg font-semibold text-white mb-4">Available Files</h3>
                        <div className="flex flex-col gap-3">
                            {book.assets.map(asset => {
                                const sizeMB = (asset.fileSize / (1024 * 1024)).toFixed(2);
                                const currentHumanPage = (asset.syncedPage || 0) + 1;
                                const progressPercent = asset.pageCount > 0 
                                    ? Math.min(100, Math.round((currentHumanPage / asset.pageCount) * 100)) 
                                    : 0;
                                    
                                return (
                                    <Link key={asset.id} to={`/books/assets/${asset.id}`} className="hover:shine">
                                        <div className="flex justify-between items-center bg-surface-hover/50 p-4 rounded-lg border border-borderbase/50 hover:bg-surface-hover transition-colors">
                                            <div className="font-bold text-indigo-400 tracking-wider">
                                                {asset.fileFormat.toUpperCase()}
                                            </div>
                                            <div className="text-[10px] md:text-sm text-muted flex items-center gap-6 text-right font-medium">
                                                {/* Progress Indicator */}
                                                {asset.pageCount > 0 && (
                                                    <div className="flex items-center gap-2" title="Reading Progress">
                                                        <div className="relative w-5 h-5 flex items-center justify-center">
                                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-borderbase" strokeWidth="4" />
                                                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-500" strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - progressPercent} strokeLinecap="round" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-indigo-400">{progressPercent}% <span className="opacity-75 font-normal ml-1">(Page {currentHumanPage})</span></span>
                                                    </div>
                                                )}
                                                {asset.pageCount > 0 && <span>{asset.pageCount} Pages</span>}
                                                <span>{sizeMB} MB</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}