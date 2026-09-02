import apiClient from '../api/ApiClient';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Virtuoso } from 'react-virtuoso';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useParams } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(                                                                                                                             
      'pdfjs-dist/build/pdf.worker.min.mjs',                                                                                                                                   
      import.meta.url,                                                                                                                                                         
    ).toString();          
                                                                                                                                                                                        
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
    const [syncedPage, setSyncedPage] = useState<number | 0>(0);
    const [visibleRange, setVisibleRange] = useState({ startIndex: 0, endIndex: 0 });
    const [pageWidth, setPageWidth] = useState(Math.min(window.innerWidth - 32, 700));
    const { assetId } = useParams<{ assetId: string }>();
    const cache = useRef<Record<number, string>>({});
    const version = useRef<number>(0);
    
    useEffect(() => {
        apiClient.get(`/books/assets/${assetId}/progress`)
            .then((response) => {
                setSyncedPage(response.data.page);
                version.current = response.data.version;
            })
            .catch((error)=> {
                console.error("Error fetching current page:", error);
            });
    }, [assetId]);
        
    const rawlocalProgress = localStorage.getItem(`assetProgress_${assetId}`);
    const localProgress = rawlocalProgress ? JSON.parse(rawlocalProgress) : null;
    const page = () => {
        if (localProgress && localProgress.version < version.current) {
            return syncedPage;
        }
        else if (localProgress && localProgress.version === version.current) {
            return localProgress.page;
        }
        else {
            return syncedPage;
        }
    };

    useEffect(() => {
        const handleResize = () => setPageWidth(Math.min(window.innerWidth - 32, 700));
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize); // memory leak
    }, []);

    const options = useMemo(() => ({
        wasmUrl: '/pdfjs/wasm/',
        cMapUrl: '/pdfjs/cmaps/',
        standardFontDataUrl: '/pdfjs/standard_fonts/',
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
    
    function getlatestPage(visibleRange: { startIndex: number, endIndex: number }): number {
        // return Math.ceil((visibleRange.startIndex + visibleRange.endIndex) / 2);
        return visibleRange.startIndex
    }

    // --- Progress Syncing Logic
    // there are 2 ways we save progress, one is a timer based debounce function that saves progress every 10 seconds
    // and the other is a beacon of hope (cool name i know) that saves progress when the user leaves the page or closes the tab

    const latestPage = useRef(0);

    // --- beacon of hope: save the current page to the server when the user leaves the page or closes the tab
    // ---- currently out of order (browser sends OPTIONS first which makes it a 2 step request which ultimately fails cuz there isnt enough time) ------
    // const API_URL = import.meta.env.VITE_API_URL;
    // const isSaved = useRef(false);
    
    // const saveBeacon = () => {
    //     const token =  localStorage.getItem('token');
    //     if (!token) return;
    //     if (isSaved.current) return;
    //     fetch(`${API_URL}/books/assets/${assetId}/progress`, {
    //         method: "POST",
    //         headers: {
    //             "Authorization": `Bearer ${token}`,
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ page: latestPage.current, version: version.current }),
    //         keepalive: true
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         version.current = data.version; // update the version to force re-render and update cache
    //     })
    //     .catch(error => {
    //         console.error("Error saving progress on page unload:", error);
    //     });
    //     isSaved.current = true;
    // };

    // useEffect(() => {
    //     const handlevisibilityChange = () => {
    //         if (document.visibilityState === "hidden") 
    //             saveBeacon();
    //         else if (document.visibilityState === "visible")
    //             isSaved.current = false; // reset the flag when the user comes back to the page
    //     }
    //     window.addEventListener("visibilitychange", handlevisibilityChange);

    //     return () => {
    //         window.removeEventListener("visibilitychange", handlevisibilityChange);
    //     };
    // }, []);

    // useEffect(() => {
    //     return () => {
    //         saveBeacon();
    //     };
    // }, []);
    
    // --- end beacon of hope

    // --- timer based debounce function to limit how often we save progress to localStorage and the server
    const debounce = useCallback((func: Function, wait: number) => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        return function (...args: any[]) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(null, args), wait);
        };
    }, []);
    
    const saveProgress = (assetId: string, latestPage: number) => {
        if (latestPage === 0) return; // when virtuoso is first loaded it falsely reports the latestPage as 0, so we ignore that case to avoid saving progress as 0
        localStorage.setItem(`assetProgress_${assetId}`, JSON.stringify({ page: latestPage, version: version.current }));
        apiClient.post(`books/assets/${assetId}/progress`, { page: latestPage, version: version.current })
        .then((response) => {
            version.current = response.data.version;
            localStorage.setItem(`assetProgress_${assetId}`, JSON.stringify({ page: latestPage, version: version.current }));
        })
        .catch((error) => {
            console.error("Error saving progress:", error);
        });
    };

    const onPageChange = debounce((assetId: string, latestPage: number) => saveProgress(assetId, latestPage), 5000); // save progress every 5 seconds

    useEffect(() => {
        const handleOnline = () => {  apiClient.post(`books/assets/${assetId}/progress`, { page: latestPage.current, version: version.current }); };
        window.addEventListener('online' , handleOnline);

        return () => {
            window.removeEventListener('online', handleOnline );
        }
    }, []);

    // --- end timer based save progress function
    // --- End of Progress Syncing Logic

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
                                 initialTopMostItemIndex={Math.max(0, page())}
                                 rangeChanged={(range) => {
                                     setVisibleRange(range);
                                     latestPage.current = getlatestPage(range);                                     
                                     if (assetId) {
                                         localStorage.setItem(`assetProgress_${assetId}`, JSON.stringify({ page: latestPage.current, version: version.current }));
                                     }
                                     onPageChange(assetId, latestPage.current);
                                 }}
                                 itemContent={(index) => (
                                     <div key={`page_${index}`} style={{ minHeight: pageWidth * 1.4 }} className="mb-6 shadow-[1_1_40px_rgba(1,1,1,1)] rounded-md overflow-hidden border-borderbase bg-black">
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