export interface BookDTO
{
    id: string; // string primitive not the String object
    localTitle: string;
    localAuthors: string;
    synopsis: string;
    coverPath: string;
    addedAt: Date;
}