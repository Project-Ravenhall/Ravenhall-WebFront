export default interface Book {
    id: string;
    localTitle: string;
    localAuthors: string[];
    apiTitle: string;
    apiAuthors: string[];
    synopsis: string;
    coverUrl: string;
    addedAt: string;
    apiReleaseYear: number;
    apiGenres: string[];
    assets: Asset[];
}

export interface Asset {
    id: string;
    assetName: string;
    fileFormat: string;
    fileUrl: string;
    pageCount: number;
    syncedPage: number;
    checksum: string;
    fileSize: number;
}