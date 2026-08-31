export default interface Book {
    id: string;
    localTitle: string;
    localAuthors: string[];
    apiTitle: string;
    apiAuthors: string[];
    synopsis: string;
    coverPath: string;
    addedAt: string;
    apiReleaseYear: number;
    apiGenres: string[];
    assets: Asset[];
}

export interface Asset {
    id: string;
    fileFormat: string;
    pageCount: number;
    syncedPage: number;
    checksum: string;
    fileSize: number;
}