import { useParams } from 'react-router-dom';
import apiClient from '../api/ApiClient';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Virtuoso } from 'react-virtuoso';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CachedPage = ({ pageIndex, cache, pageWidth }: { pageIndex: number, cache: React.RefObject<Record<number, string>>, pageWidth: number }) => {
    const pageNumber = pageIndex + 1;
    const containerRef = useRef<HTMLDivElement>(null);
    const [, forceUpdate] = useState({});

  
    if (cache.current[pageNumber]) {
        return (
            <div className="relative w-full max-w-[700px] flex justify-center">
                {/* this part instantly loaded cached image (dictates height instantly for Virtuoso) */}
                <img 
                    src={cache.current[pageNumber]} 
                    alt={`Page ${pageNumber}`} 
                    className="w-full h-auto object-contain relative z-0" 
                />
                {/* this is the invisible text layer (loads in background to enables highlighting) */}
                <div className="absolute inset-0 z-10 w-full h-full">
                    <Page pageNumber={pageNumber} width={pageWidth} renderMode="none" />
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full max-w-[700px] flex justify-center">
            <Page 
                pageNumber={pageNumber}
                width={pageWidth} 
                onRenderSuccess={() => {
                    const canvas = containerRef.current?.querySelector('canvas');
                    if (canvas) {
                        // compress to jpeg to 80% quality to save memory, and store in cache
                        cache.current[pageNumber] = canvas.toDataURL('image/jpeg', 0.8);
                        forceUpdate({});// force the component to re-render so that it can now use the cached image
                    }
                }}
            />
        </div>
    );
};

export const Asset = () => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { assetId } = useParams<{ assetId: string }>();

    const cache = useRef<Record<number, string>>({});
    const [visibleRange, setVisibleRange] = useState({ startIndex: 0, endIndex: 0 });
    const [pageWidth, setPageWidth] = useState(Math.min(window.innerWidth - 32, 700));

    useEffect(() => {
        const handleResize = () => setPageWidth(Math.min(window.innerWidth - 32, 700));
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize); // memory leak
    }, []);

    const options = useMemo(() => ({
        wasmUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/wasm/`,
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }), []);

    useEffect(() => {
        let activeUrl: string | null = null;

        if(assetId) { 
            apiClient.get(`/books/assets/${assetId}`, {
                responseType: 'arraybuffer',
            })
            .then((res) => {
                const blob = new Blob([res.data], { type: 'application/pdf' });
                activeUrl = URL.createObjectURL(blob);
                setResponse(activeUrl);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching asset:", error);
                setLoading(false);
            });
        }

        // we revoke the object URL when the component unmounts or when assetId changes to avoid memory leaks
        return () => {
            if (activeUrl) {
                URL.revokeObjectURL(activeUrl);
            }
            cache.current = {}; // we instantly drop all cached pages
        };
    }, [assetId]);

    // delete out of range pages from cache to save memory (espically for mobile users)
    useEffect(() => {
        const keep = new Set<number>();
        for (let i = visibleRange.startIndex - 5; i <= visibleRange.endIndex + 5; i++) {
            keep.add(i + 1); 
        }
        
        Object.keys(cache.current).forEach((key) => {
            if (!keep.has(Number(key))) {
                delete cache.current[Number(key)];
            }
        });
    }, [visibleRange]);

    const prefetchTargets = useMemo(() => {
        if (!numPages) return [];
        const targets = [];
        // it gets the 2 pages ahead of index, and checks if its already in cache
        for (let i = visibleRange.endIndex + 1; i <= visibleRange.endIndex + 2; i++) {
            if (i >= 0 && i < numPages && !cache.current[i + 1]) targets.push(i);
        }
        // same thing but behind
        for (let i = visibleRange.startIndex - 2; i < visibleRange.startIndex; i++) {
            if (i >= 0 && i < numPages && !cache.current[i + 1]) targets.push(i);
        }
        return targets;
    }, [visibleRange, numPages]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }
    
    return (
        <div className="min-h-screen w-full bg-base flex flex-col items-center py-8">
            {loading ? (
                 <div className="text-muted animate-pulse mt-20">Loading Book...</div>
            ) : (
                 <div className="w-full max-w-[700px] relative">
                     <Document file={response} options={options} onLoadSuccess={onDocumentLoadSuccess}>
                         <div style={{ position: 'absolute', top: -99999, left: 0, visibility: 'hidden' }}>
                             {prefetchTargets.map((index) => (
                                 <CachedPage key={`prefetch_${index}`} pageIndex={index} cache={cache} pageWidth={pageWidth} />
                             ))}
                         </div>
                         {numPages && (
                             <Virtuoso
                                 useWindowScroll
                                 totalCount={numPages}
                                 rangeChanged={(range) => setVisibleRange(range)}
                                 itemContent={(index) => (
                                     <div key={`page_${index}`} className="mb-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-md overflow-hidden border border-borderbase bg-white min-h-[50vh]">
                                         <CachedPage pageIndex={index} cache={cache} pageWidth={pageWidth} />
                                     </div>
                                 )}
                             />
                         )}
                     </Document>
                 </div>
            )}
        </div>
    );
}