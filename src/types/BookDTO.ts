export default interface BookDTO {
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
    assets: AssetDTO[];
}

export interface AssetDTO {
    id: string;
    fileFormat: string;
    filepath: string;
    pageCount: number;
    checksum: string;
    fileSize: number;
}